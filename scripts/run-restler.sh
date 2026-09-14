#!/bin/bash

# Run RESTler against the Gatelin API
# Runs microsoft/restler-fuzzer against the API through Traefik.
#
# Assumes the development stack is already running (via ./scripts/start-dev.sh),
# matching the e2e (scripts/e2e.sh) and perf (scripts/run-perf.sh) test flows.
#
# Because RESTler fuzzer tests mutate data (sending bulk-update and garbage values
# to endpoints), running locally will automatically reset the database at the end
# (via ./scripts/reset-db.sh) to ensure a clean state while leaving the stack running.
# In CI, the reset is skipped because the workflow stops the stack at the end.
#
# Usage: ./scripts/run-restler.sh [test|fuzz-lean|fuzz] [--no-reset] [--reset-db]
#   test        (default) smoketest — verifies every endpoint can be reached at least once
#   fuzz-lean   fuzzes each endpoint once with the default checkers
#   fuzz        full fuzzing run (time budget: $RESTLER_TIME_BUDGET hours, default 1)
#   --no-reset  skip automatic database reset after the run (local only)
#   --reset-db  force database reset after the run
#
# Results are written to tests/restler/results/.

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ENV_FILE="docker/conf/.env.dev"
MAIN_COMPOSE="docker/docker-compose.yml"
RESTLER_COMPOSE="docker/docker-compose.restler.yml"
RESULTS_DIR="tests/restler/results"
SWAGGER_FILE="swagger/src/gatelin.openapi.json"

MODE="test"
NO_RESET=false
FORCE_RESET=false

for arg in "$@"; do
  case "$arg" in
    test|fuzz-lean|fuzz) MODE="$arg" ;;
    --no-reset) NO_RESET=true ;;
    --reset-db) FORCE_RESET=true ;;
    --keep) ;; # legacy no-op for backward compatibility
    *)
      echo -e "${RED}✗ Unknown argument: $arg${NC}"
      echo "Usage: $0 [test|fuzz-lean|fuzz] [--no-reset] [--reset-db]"
      exit 1
      ;;
  esac
done

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
fi

# Ensure mock credentials are present in Swagger
if [[ ! -f "$SWAGGER_FILE" ]] || ! grep -q '"email": "admin@example.com"' "$SWAGGER_FILE"; then
  echo -e "${YELLOW}🔐 Seeding Foxnox mock passwords into ${SWAGGER_FILE}...${NC}"
  ./scripts/setup-mocks.sh --if-missing
fi

mkdir -p "$RESULTS_DIR"

echo -e "${YELLOW}🧪 Running RESTler (${MODE}) against the API...${NC}"
set +e
RESTLER_MODE="$MODE" docker compose -f "$RESTLER_COMPOSE" --env-file "$ENV_FILE" \
  up --build --abort-on-container-exit --exit-code-from restler
RESTLER_EXIT=$?
set -e
docker compose -f "$RESTLER_COMPOSE" --env-file "$ENV_FILE" down

# If running locally (not in CI) and --no-reset was not passed, reset the database
# to clean up mutated rows from fuzzing while leaving the stack running.
if [[ -z "${CI:-}" ]] && [[ "$NO_RESET" != true ]]; then
  echo -e "${YELLOW}🔄 Resetting database to clean fixtures after local RESTler run...${NC}"
  ./scripts/reset-db.sh
fi

if [[ $RESTLER_EXIT -eq 0 ]]; then
  echo -e "${GREEN}✅ RESTler ${MODE} run passed.${NC}"
else
  echo -e "${RED}✗ RESTler ${MODE} run failed (exit ${RESTLER_EXIT}).${NC}"
fi

RUN_SUMMARY=$(find "$RESULTS_DIR" -name "runSummary.json" 2>/dev/null | sort | tail -1)
SPEC_COV=$(find "$RESULTS_DIR" -name "speccov.json" 2>/dev/null | sort | tail -1)
COVERAGE_FAILURES=$(find "$RESULTS_DIR" -name "coverage_failures_to_investigate.txt" 2>/dev/null | sort | tail -1)
BUG_BUCKETS=$(find "$RESULTS_DIR" -name "bug_buckets.txt" 2>/dev/null | sort | tail -1)
NETWORK_TRACE=$(find "$RESULTS_DIR" -name "network.testing.*.txt" 2>/dev/null | sort | tail -1)

if [[ -n "$RUN_SUMMARY" ]]; then
  echo -e "   📊 Run summary:      $RUN_SUMMARY"
fi
if [[ -n "$SPEC_COV" ]]; then
  echo -e "   📈 Spec coverage:    $SPEC_COV"
fi
if [[ -n "$COVERAGE_FAILURES" ]]; then
  echo -e "   🔍 Coverage issues:  $COVERAGE_FAILURES"
fi
if [[ -n "$BUG_BUCKETS" ]]; then
  echo -e "   🐛 Bug buckets:      $BUG_BUCKETS"
fi
if [[ -n "$NETWORK_TRACE" ]]; then
  echo -e "   📝 Raw HTTP trace:   $NETWORK_TRACE"
fi

exit $RESTLER_EXIT
