#!/bin/bash

# Run RESTler against the Gatelin API
# Starts the dependency stack (postgres, traefik, migrations, gatelin, mocks),
# waits for gatelin to be healthy, then runs microsoft/restler-fuzzer against
# it through Traefik.
#
# RESTler's own fuzzing mutates data (it sends bulk-update/archive requests
# with garbage values to every endpoint, including PUT /gateway/services).
# Because the postgres container uses a persistent named volume, a prior
# run's fuzzing can corrupt the seeded "core" config rows that gatelin's own
# self-routing (checkRoute -> services/route.js) depends on -- e.g. the
# "gatelin" service's own `pattern` column getting overwritten with a fuzz
# string breaks the URL match for every route, including login, and every
# request then 400s. So this script wipes the postgres volume and re-runs
# migrations before every invocation to guarantee a clean, known-good seed.
#
# Usage: ./scripts/run-restler.sh [test|fuzz-lean|fuzz] [--keep]
#   test        (default) smoketest — verifies every endpoint can be reached at least once
#   fuzz-lean   fuzzes each endpoint once with the default checkers
#   fuzz        full fuzzing run (time budget: $RESTLER_TIME_BUDGET hours, default 1)
#   --keep      leave the dependency stack running afterwards (default: stop it)
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

MODE="test"
KEEP_STACK=false
for arg in "$@"; do
  case "$arg" in
    test|fuzz-lean|fuzz) MODE="$arg" ;;
    --keep) KEEP_STACK=true ;;
    *)
      echo -e "${RED}✗ Unknown argument: $arg${NC}"
      echo "Usage: $0 [test|fuzz-lean|fuzz] [--keep]"
      exit 1
      ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo -e "${RED}✗ $ENV_FILE not found. Run ./scripts/setup-env.sh first.${NC}"
  exit 1
fi
if [[ ! -f swagger/src/gatelin.openapi.json ]]; then
  echo -e "${RED}✗ swagger/src/gatelin.openapi.json not found. Run ./scripts/setup-mocks.sh first.${NC}"
  exit 1
fi

mkdir -p "$RESULTS_DIR" node_modules admin/node_modules

echo -e "${YELLOW}🗑️  Resetting postgres so this run starts from the seeded fixtures...${NC}"
docker compose -f "$MAIN_COMPOSE" --env-file "$ENV_FILE" rm -f -s postgres gatelin_migration gatelin >/dev/null 2>&1 || true
set -a
# shellcheck disable=SC1090
source <(grep -v '^#' "$ENV_FILE" | grep -v '^UID=')
set +a
docker volume rm "${APP_NAME}_postgres_data" >/dev/null 2>&1 || true

echo -e "${YELLOW}🚀 Starting dependency stack (postgres, traefik, migrations, gatelin, mocks)...${NC}"
docker compose -f "$MAIN_COMPOSE" --env-file "$ENV_FILE" up --build -d \
  postgres traefik gatelin_migration gatelin ms_pwd_mock ms_user_mock

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

echo -e "${YELLOW}🧪 Running RESTler (${MODE}) against the API...${NC}"
set +e
RESTLER_MODE="$MODE" docker compose -f "$RESTLER_COMPOSE" --env-file "$ENV_FILE" \
  up --build --abort-on-container-exit --exit-code-from restler
RESTLER_EXIT=$?
set -e
docker compose -f "$RESTLER_COMPOSE" --env-file "$ENV_FILE" down

if [[ "$KEEP_STACK" != true ]]; then
  echo -e "${YELLOW}🛑 Stopping dependency stack...${NC}"
  docker compose -f "$MAIN_COMPOSE" --env-file "$ENV_FILE" down
fi

if [[ $RESTLER_EXIT -eq 0 ]]; then
  echo -e "${GREEN}✅ RESTler ${MODE} run passed. Results in ${RESULTS_DIR}/${NC}"
else
  echo -e "${RED}✗ RESTler ${MODE} run failed (exit ${RESTLER_EXIT}). See ${RESULTS_DIR}/${NC}"
fi
exit $RESTLER_EXIT
