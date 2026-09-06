#!/bin/bash
set -euo pipefail

# Seeds mock user passwords by calling Foxnox's POST /foxnox/ endpoint (generate +
# hash server-side), then substitutes the returned plaintexts into
# swagger/src/gatelin.openapi.json.
#
# Because seeding happens via the running service, the stack must be up first:
#     scripts/setup-env.sh  →  scripts/start-dev.sh  →  scripts/setup-mocks.sh
#
# Idempotent: re-runs delete the previous mock pwd rows, generate fresh plaintexts,
# and reload swagger. Run this any time you want to rotate the mock credentials.
#
# Usage: setup-mocks.sh [--if-missing]
#   --if-missing : exit without touching anything when mock pwd rows already exist.
#                  start-dev.sh uses this so a fresh postgres volume gets seeded
#                  automatically while an ordinary restart keeps its passwords.

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ENV_FILE="docker/conf/.env.dev"
SWAGGER_EXAMPLE="swagger/src/gatelin.openapi.example.json"
SWAGGER_FILE="swagger/src/gatelin.openapi.json"

# userId → swagger placeholder. Matches mocks/ms_user personas.
MOCK_PLACEHOLDERS=(
  "1:__PWD_GATELIN_ADMIN__"
  "2:__PWD_GATELIN_USER__"
  "3:__PWD_GATELIN_SUPER_ADMIN__"
  "4:__PWD_GATELIN_GUEST__"
  "5:__PWD_EBOUTIQUE_USER__"
  "6:__PWD_EBOUTIQUE_SUPER_ADMIN__"
  "7:__PWD_EBOUTIQUE_ADMIN__"
)
MOCK_USER_IDS=(1 2 3 4 5 6 7)

IF_MISSING=false
if [[ "${1:-}" == "--if-missing" ]]; then
  IF_MISSING=true
fi

if [[ "$OSTYPE" == "darwin"* ]]; then
  sedi() { sed -i '' "$@"; }
else
  sedi() { sed -i "$@"; }
fi

placeholder_for() {
  local uid="$1"
  local entry
  for entry in "${MOCK_PLACEHOLDERS[@]}"; do
    if [[ "${entry%%:*}" == "$uid" ]]; then
      echo "${entry#*:}"
      return 0
    fi
  done
  return 1
}

if [[ ! -f "$ENV_FILE" ]]; then
  echo -e "${RED}Error:${NC} $ENV_FILE not found. Run scripts/setup-env.sh first." >&2
  exit 1
fi

ENV_TMP=$(mktemp)
grep -v '^#' "$ENV_FILE" | grep -v '^UID=' > "$ENV_TMP"
set -a
# shellcheck disable=SC1090
source "$ENV_TMP"
set +a
rm -f "$ENV_TMP"

: "${FOXNOX_HOST:?FOXNOX_HOST missing from $ENV_FILE}"
: "${POSTGRES_HOST:?POSTGRES_HOST missing from $ENV_FILE}"
: "${POSTGRES_ROOT_USER:?POSTGRES_ROOT_USER missing from $ENV_FILE}"
: "${POSTGRES_ROOT_PWD:?POSTGRES_ROOT_PWD missing from $ENV_FILE}"
: "${FOXNOX_DB_NAME:?FOXNOX_DB_NAME missing from $ENV_FILE}"
: "${DEFAULT_PORT:?DEFAULT_PORT missing from $ENV_FILE}"
: "${SWAGGER_HOST:?SWAGGER_HOST missing from $ENV_FILE}"

echo -e "${YELLOW}⏳ Waiting for ${FOXNOX_HOST} to be healthy...${NC}"
for i in {1..30}; do
  status=$(docker inspect -f '{{.State.Health.Status}}' "$FOXNOX_HOST" 2>/dev/null || echo "missing")
  if [[ "$status" == "healthy" ]]; then
    echo -e "${GREEN}✓${NC} ${FOXNOX_HOST} is healthy"
    break
  fi
  if [[ "$status" == "missing" ]]; then
    echo -e "${RED}Error:${NC} container ${FOXNOX_HOST} not found. Run scripts/start-dev.sh first." >&2
    exit 1
  fi
  sleep 2
  if [[ $i -eq 30 ]]; then
    echo -e "${RED}Error:${NC} timed out waiting for ${FOXNOX_HOST} to become healthy (last status: $status)." >&2
    exit 1
  fi
done

IDS_CSV=$(IFS=,; echo "${MOCK_USER_IDS[*]}")

if [[ "$IF_MISSING" == true ]]; then
  EXISTING=$(docker exec -e PGPASSWORD="$POSTGRES_ROOT_PWD" "$POSTGRES_HOST" \
    psql -U "$POSTGRES_ROOT_USER" -d "$FOXNOX_DB_NAME" -tAc \
    "SELECT COUNT(*) FROM pwd WHERE \"userId\" IN (${IDS_CSV})" 2>/dev/null || echo "")
  if [[ -n "${EXISTING//[[:space:]]/}" && "${EXISTING//[[:space:]]/}" != "0" ]]; then
    echo -e "${GREEN}✓${NC} Mock passwords already seeded — leaving them untouched."
    echo -e "  Run ${YELLOW}scripts/setup-mocks.sh${NC} (no flag) to rotate them."
    exit 0
  fi
  echo -e "${YELLOW}🌱 No mock passwords found — seeding them now...${NC}"
fi

echo -e "${YELLOW}🧹 Removing previous mock pwd rows (userId IN (${IDS_CSV}))...${NC}"
docker exec -e PGPASSWORD="$POSTGRES_ROOT_PWD" "$POSTGRES_HOST" \
  psql -U "$POSTGRES_ROOT_USER" -d "$FOXNOX_DB_NAME" -v ON_ERROR_STOP=1 -c \
  "DELETE FROM pwd WHERE \"userId\" IN (${IDS_CSV})" >/dev/null

BODY_JSON="{\"rows\":[$(printf '{"userId":%s},' "${MOCK_USER_IDS[@]}" | sed 's/,$//')]}"
echo -e "${YELLOW}🔐 Generating passwords via POST /foxnox/ ...${NC}"
RESPONSE=$(docker exec -i "$FOXNOX_HOST" node -e '
  let body = "";
  process.stdin.on("data", (c) => body += c);
  process.stdin.on("end", () => {
    const http = require("http");
    const req = http.request({
      host: "localhost",
      port: process.env.PORT || 3000,
      path: "/foxnox/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        // Tracked writes are rejected without a consumer, since that is what
        // stamps the audit columns the history trigger requires.
        "x-consumer-user-id": "1",
        "x-consumer-name": "seed-script",
      },
    }, (res) => {
      let out = "";
      res.on("data", (c) => out += c);
      res.on("end", () => {
        if (res.statusCode >= 400) {
          process.stderr.write(`POST /foxnox/ failed (${res.statusCode}): ${out}\n`);
          process.exit(1);
        }
        process.stdout.write(out);
      });
    });
    req.on("error", (err) => { process.stderr.write(err.message + "\n"); process.exit(1); });
    req.write(body); req.end();
  });
' <<< "$BODY_JSON")

# Challenge personas: 2FA (coco), expired password (guest), locked (ebuser).
echo -e "${YELLOW}🧪 Applying mid-login challenge states...${NC}"
docker exec -e PGPASSWORD="$POSTGRES_ROOT_PWD" "$POSTGRES_HOST" \
  psql -U "$POSTGRES_ROOT_USER" -d "$FOXNOX_DB_NAME" -v ON_ERROR_STOP=1 -c \
  "UPDATE pwd SET \"twoFactorEnabled\" = true,
     \"updaterId\" = -1, \"updaterName\" = 'system', \"updatedAt\" = NOW()
   WHERE \"userId\" = 3;
   UPDATE pwd SET \"pwdExpiry\" = '2020-01-01T00:00:00Z',
     \"updaterId\" = -1, \"updaterName\" = 'system', \"updatedAt\" = NOW()
   WHERE \"userId\" = 4;
   UPDATE pwd SET \"failedAttempts\" = 3, \"lockedUntil\" = '2099-01-01T00:00:00Z',
     \"updaterId\" = -1, \"updaterName\" = 'system', \"updatedAt\" = NOW()
   WHERE \"userId\" = 5;" >/dev/null

cp "$SWAGGER_EXAMPLE" "$SWAGGER_FILE"

PAIRS=$(docker exec -i "$FOXNOX_HOST" node -e '
  let d = "";
  process.stdin.on("data", (c) => d += c);
  process.stdin.on("end", () => {
    for (const r of JSON.parse(d).rows) console.log(`${r.userId}\t${r.pwd}`);
  });
' <<< "$RESPONSE")

echo ""
echo "Mock user plaintext passwords (printed once, not stored):"
while IFS=$'\t' read -r uid pwd; do
  [[ -z "$uid" ]] && continue
  token=$(placeholder_for "$uid") || {
    echo -e "${RED}Error:${NC} no swagger placeholder mapped for userId ${uid}" >&2
    exit 1
  }
  sedi -e "s|${token}|${pwd}|g" "$SWAGGER_FILE"
  printf "  userId %-3s (%s) = %s\n" "$uid" "$token" "$pwd"
done <<< "$PAIRS"

echo ""
echo -e "${YELLOW}🔁 Reloading swagger container...${NC}"
if docker compose -f docker/docker-compose.yml --env-file "$ENV_FILE" restart swagger >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Done. Swagger is showing the fresh mock credentials at ${SERVER_SCHEME:-http://}${SERVER_URL:-localhost}:${TRAEFIK_PORT:-8100}/swagger${NC}"
else
  echo -e "${GREEN}✅ Done.${NC} Swagger container was not running — ${SWAGGER_FILE} is updated on disk."
fi
