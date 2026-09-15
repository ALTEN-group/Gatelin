#!/bin/bash

# Run k6 performance scenarios inside a dedicated container against the running
# dev stack. Requires: `scripts/start-dev.sh` already succeeded.
#
# Usage: ./scripts/run-perf.sh [health|login|resource-crud|all] [--reset-db|--no-reset]
#   health         (default) baseline unauthenticated /gatelin/health load
#   login          login/logout flow (auth + RBAC resolution + session cache)
#   resource-crud  authenticated search/schema flow on /gatelin/resources
#   all            run all three scenarios sequentially
#   --reset-db     force database reset after run even for read-only scenarios
#   --no-reset     skip automatic database reset on local runs
#
# In local development, scenarios that write session records (login, resource-crud, all)
# automatically reset the database at the end to leave fixtures clean.
# In CI, database resets are skipped between steps and the stack is stopped
# at workflow completion via scripts/stop-dev.sh.
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

SCENARIOS=()
FORCE_RESET=false
NO_RESET=false

for arg in "$@"; do
  case "$arg" in
    health|login|resource-crud) SCENARIOS+=("$arg") ;;
    all) SCENARIOS=("health" "login" "resource-crud") ;;
    --reset-db) FORCE_RESET=true ;;
    --no-reset) NO_RESET=true ;;
    --keep) ;; # retained as no-op for backwards compatibility
    *)
      echo -e "${RED}✗ Unknown argument: $arg${NC}"
      echo "Usage: $0 [health|login|resource-crud|all] [--reset-db|--no-reset]"
      exit 1
      ;;
  esac
done

if [[ ${#SCENARIOS[@]} -eq 0 ]]; then
  SCENARIOS=("health")
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo -e "${RED}✗ $ENV_FILE not found. Run ./scripts/setup-env.sh first.${NC}"
  exit 1
fi

# Verify the dev stack is running
GATELIN_CID=$(docker compose -f "$MAIN_COMPOSE" --env-file "$ENV_FILE" ps -q gatelin 2>/dev/null || true)
if [[ -z "$GATELIN_CID" ]]; then
  echo -e "${RED}✗ Gatelin is not running. Please start the development stack first: ./scripts/start-dev.sh${NC}"
  exit 1
fi

STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$GATELIN_CID" 2>/dev/null || echo "starting")
if [[ "$STATUS" != "healthy" ]]; then
  echo -e "${YELLOW}⏳ Waiting for gatelin to become healthy...${NC}"
  for _ in $(seq 1 15); do
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$GATELIN_CID" 2>/dev/null || echo "starting")
    [[ "$STATUS" == "healthy" ]] && break
    sleep 2
  done
  if [[ "$STATUS" != "healthy" ]]; then
    echo -e "${RED}✗ gatelin did not become healthy in time (status: $STATUS)${NC}"
    docker compose -f "$MAIN_COMPOSE" --env-file "$ENV_FILE" logs gatelin
    exit 1
  fi
fi

mkdir -p "$RESULTS_DIR"

HAS_WRITES=false
for s in "${SCENARIOS[@]}"; do
  if [[ "$s" != "health" ]]; then
    HAS_WRITES=true
    break
  fi
done

K6_PWD=""
if [[ "$HAS_WRITES" == true ]]; then
  if [[ ! -f "$SWAGGER_FILE" ]] || ! grep -q '"email": "admin@example.com"' "$SWAGGER_FILE"; then
    echo -e "${YELLOW}🔐 Seeding Foxnox mock passwords into ${SWAGGER_FILE}...${NC}"
    ./scripts/setup-mocks.sh --if-missing
  fi
  # admin@example.com's plaintext pwd sits on the line right after its email in
  # the seeded swagger file (setup-mocks.sh substitutes both in place).
  K6_PWD=$(grep -A1 '"email": "admin@example.com"' "$SWAGGER_FILE" 2>/dev/null | grep '"pwd"' | head -1 | sed -E 's/.*"pwd": *"([^"]+)".*/\1/')
  if [[ -z "$K6_PWD" ]]; then
    echo -e "${RED}✗ Could not extract admin@example.com password from ${SWAGGER_FILE}.${NC}"
    exit 1
  fi
fi

OVERALL_EXIT=0
for SCENARIO in "${SCENARIOS[@]}"; do
  echo -e "${YELLOW}🧪 Running k6 (${SCENARIO}) against the API...${NC}"
  set +e
  EXTRA_ARGS=()
  if [[ "$SCENARIO" == "login" ]]; then
    EXTRA_ARGS+=(--vus "${K6_LOGIN_VUS:-1}")
  fi

  K6_EMAIL="admin@example.com" K6_PWD="$K6_PWD" \
    docker compose -f "$PERF_COMPOSE" --env-file "$ENV_FILE" run --rm \
    -e K6_EMAIL -e K6_PWD \
    -e K6_WEB_DASHBOARD=true -e K6_WEB_DASHBOARD_PERIOD=1s \
    -e K6_WEB_DASHBOARD_EXPORT="/results/${SCENARIO}.report.html" \
    k6 run "${EXTRA_ARGS[@]}" --summary-export "/results/${SCENARIO}.summary.json" "/scripts/${SCENARIO}.js"
  K6_EXIT=$?
  set -e

  if [[ $K6_EXIT -eq 0 ]]; then
    echo -e "${GREEN}✅ k6 ${SCENARIO} run passed.${NC}"
  else
    echo -e "${RED}✗ k6 ${SCENARIO} run failed (exit ${K6_EXIT}).${NC}"
    OVERALL_EXIT=$K6_EXIT
  fi
  echo -e "   📊 HTML report:  ${RESULTS_DIR}/${SCENARIO}.report.html"
  echo -e "   📄 JSON summary:  ${RESULTS_DIR}/${SCENARIO}.summary.json"
done

# Convert scenario summaries to benchmark.json if node is available
if command -v node >/dev/null 2>&1 && [[ -f "tests/perf/scripts/to-benchmark.js" ]]; then
  node tests/perf/scripts/to-benchmark.js 2>/dev/null || true
  if [[ -f "${RESULTS_DIR}/benchmark.json" ]]; then
    echo -e "   📈 Benchmark:    ${RESULTS_DIR}/benchmark.json"
  fi
fi

# If running locally (not in CI) and a scenario modified the database (or --reset-db was passed),
# automatically reset the database and refresh Gatelin's in-memory cache so dev stays clean.
if [[ -z "${CI:-}" ]] && [[ "$NO_RESET" != true ]] && ([[ "$HAS_WRITES" == true ]] || [[ "$FORCE_RESET" == true ]]); then
  echo -e "${YELLOW}🔄 Resetting database to clean fixtures after local perf run...${NC}"
  ./scripts/reset-db.sh
fi

exit $OVERALL_EXIT
