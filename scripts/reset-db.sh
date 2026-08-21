#!/bin/bash

# Reset Database Script
# Removes postgres + migration containers and the postgres volume, then rebuilds
# the stack via start-dev.sh. Gatelin is stopped first (not deleted) so Compose
# can start it again after migrations have completed against the empty database.

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🗑️  Resetting database...${NC}"

ENV_FILE="docker/conf/.env.dev"
if [[ ! -f "$ENV_FILE" ]]; then
  echo -e "${RED}Error:${NC} $ENV_FILE not found. Run scripts/setup-env.sh first." >&2
  exit 1
fi

# Load container names from .env.dev.
ENV_TMP=$(mktemp)
grep -v '^#' "$ENV_FILE" | grep -v '^UID=' > "$ENV_TMP"
set -a
# shellcheck disable=SC1090
source "$ENV_TMP"
set +a
rm -f "$ENV_TMP"

: "${POSTGRES_HOST:?POSTGRES_HOST missing from $ENV_FILE}"
: "${GATELIN_MIGRATION_HOST:?GATELIN_MIGRATION_HOST missing from $ENV_FILE}"
: "${GATELIN_HOST:?GATELIN_HOST missing from $ENV_FILE}"
: "${APP_NAME:?APP_NAME missing from $ENV_FILE}"

VOLUME_NAME="${APP_NAME}_postgres_data"

# Stop Gatelin before the database disappears.
#
# Its connection pool lives in @dwtechs/antity-pgsql, which registers no 'error'
# handler on the pg Pool. Deleting Postgres under an idle connection therefore
# raises "Connection terminated unexpectedly" as an unhandled event and kills
# the process — and under `node --watch` it then sits at "Waiting for file
# changes" rather than restarting. Shutting it down first avoids the crash;
# start-dev.sh starts it again after postgres is healthy and migrations have
# completed, which also rebuilds the in-memory route/CORS caches from the
# re-seeded database. The container holds no state, so stopping is enough.
echo -e "🛑 Stopping app containers..."
if docker stop "$GATELIN_HOST" >/dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Stopped $GATELIN_HOST"
else
  echo -e "${YELLOW}⚠${NC}  Container $GATELIN_HOST not running"
fi

# Remove the database and migration containers. These do have to go: Postgres
# must detach from the volume, and the one-shot migration container only
# re-runs when recreated (compose's service_completed_successfully is
# satisfied by a stale exit 0).
echo -e "📦 Removing containers..."
for c in "$GATELIN_MIGRATION_HOST" "$POSTGRES_HOST"; do
  if docker rm -f "$c" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Removed $c"
  else
    echo -e "${YELLOW}⚠${NC}  Container $c not found"
  fi
done

# Remove volume
echo -e "💾 Removing volume..."
if ! docker volume inspect "$VOLUME_NAME" >/dev/null 2>&1; then
  echo -e "${YELLOW}⚠${NC}  Volume $VOLUME_NAME not found"
elif docker volume rm "$VOLUME_NAME"; then
  echo -e "${GREEN}✓${NC} Removed volume $VOLUME_NAME"
else
  echo -e "${RED}✗${NC} Failed to remove volume $VOLUME_NAME (still in use?) — aborting so the fresh restart doesn't reuse stale data"
  exit 1
fi

echo -e "${GREEN}✅ Database reset complete!${NC}"

# Rebuild postgres, re-run migrations, then start Gatelin (Compose waits for
# postgres healthy + migration completed before starting the stopped app).
echo -e ""
./scripts/start-dev.sh

echo -e ""
echo -e "${GREEN}🎉 All done! Application ready with fresh database.${NC}"
