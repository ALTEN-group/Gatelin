#!/bin/bash

# Run k6 performance scenarios against the Gatelin API.
# Starts the dependency stack (postgres, traefik, migrations, gatelin, foxnox, mocks),
# seeds mock credentials, waits for gatelin to be healthy, then runs k6
# through Traefik the same way scripts/run-restler.sh drives RESTler.
#
# Usage: ./scripts/run-perf.sh [health|login|resource-crud] [--keep]
#   health         (default) baseline unauthenticated /gatelin/health load
#   login          login/logout flow (auth + RBAC resolution + session cache)
#   resource-crud  authenticated search/schema flow on /gatelin/resources
#   --keep         leave the dependency stack running afterwards (default: stop it)
#
# Env overrides: K6_VUS (default 10), K6_DURATION (default 30s).
# Results are written to tests/perf/results/.

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ENV_FILE="docker/conf/.env.dev"
MAIN_COMPOSE="docker/docker-compose.yml"
PERF_COMPOSE="docker/docker-compose.perf.yml"
RESULTS_DIR="tests/perf/results"
SWAGGER_FILE="swagger/src/gatelin.openapi.json"

SCENARIO="health"
KEEP_STACK=false
for arg in "$@"; do
  case "$arg" in
    health|login|resource-crud) SCENARIO="$arg" ;;
    --keep) KEEP_STACK=true ;;
    *)
      echo -e "${RED}✗ Unknown argument: $arg${NC}"
      echo "Usage: $0 [health|login|resource-crud] [--keep]"
      exit 1
      ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo -e "${RED}✗ $ENV_FILE not found. Run ./scripts/setup-env.sh first.${NC}"
  exit 1
fi

mkdir -p "$RESULTS_DIR"

set -a
# shellcheck disable=SC1090
source <(grep -v '^#' "$ENV_FILE" | grep -v '^UID=')
set +a

echo -e "${YELLOW}🚀 Starting dependency stack (postgres, traefik, migrations, gatelin, foxnox, mocks)...${NC}"
docker compose -f "$MAIN_COMPOSE" --env-file "$ENV_FILE" up --build -d \
  postgres traefik gatelin_migration foxnox_migration mailpit foxnox gatelin ms_user_mock swagger

echo -e "${YELLOW}🔐 Seeding Foxnox mock passwords into ${SWAGGER_FILE}...${NC}"
./scripts/setup-mocks.sh --if-missing

echo -e "${YELLOW}⏳ Waiting for gatelin to become healthy...${NC}"
GATELIN_CID=$(docker compose -f "$MAIN_COMPOSE" --env-file "$ENV_FILE" ps -q gatelin)
STATUS=""
for _ in $(seq 1 30); do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$GATELIN_CID" 2>/dev/null || echo "starting")
  [[ "$STATUS" == "healthy" ]] && break
  sleep 2
done
if [[ "$STATUS" != "healthy" ]]; then
  echo -e "${RED}✗ gatelin did not become healthy in time (status: $STATUS)${NC}"
  docker compose -f "$MAIN_COMPOSE" --env-file "$ENV_FILE" logs gatelin
  exit 1
fi

# admin@example.com's plaintext pwd sits on the line right after its email in
# the seeded swagger file (setup-mocks.sh substitutes both in place).
K6_PWD=$(grep -A1 '"email": "admin@example.com"' "$SWAGGER_FILE" | grep '"pwd"' | head -1 | sed -E 's/.*"pwd": *"([^"]+)".*/\1/')
if [[ -z "$K6_PWD" ]]; then
  echo -e "${RED}✗ Could not extract admin@example.com password from ${SWAGGER_FILE}.${NC}"
  exit 1
fi

echo -e "${YELLOW}🧪 Running k6 (${SCENARIO}) against the API...${NC}"
set +e
K6_EMAIL="admin@example.com" K6_PWD="$K6_PWD" \
  docker compose -f "$PERF_COMPOSE" --env-file "$ENV_FILE" run --rm \
  -e K6_EMAIL -e K6_PWD \
  k6 run --summary-export "/results/${SCENARIO}.summary.json" "/scripts/${SCENARIO}.js"
K6_EXIT=$?
set -e
docker compose -f "$PERF_COMPOSE" --env-file "$ENV_FILE" down

if [[ "$KEEP_STACK" != true ]]; then
  echo -e "${YELLOW}🛑 Stopping dependency stack...${NC}"
  docker compose -f "$MAIN_COMPOSE" --env-file "$ENV_FILE" down
fi

if [[ $K6_EXIT -eq 0 ]]; then
  echo -e "${GREEN}✅ k6 ${SCENARIO} run passed. Results in ${RESULTS_DIR}/${NC}"
else
  echo -e "${RED}✗ k6 ${SCENARIO} run failed (exit ${K6_EXIT}). See ${RESULTS_DIR}/${NC}"
fi
exit $K6_EXIT
