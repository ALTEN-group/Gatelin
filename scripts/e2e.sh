#!/bin/bash
set -euo pipefail

# Run Playwright end-to-end tests inside a dedicated container against the running
# dev stack. Requires: `scripts/start-dev.sh` already succeeded and (usually)
# `scripts/setup-mocks.sh` if the tests read mock credentials from the swagger file.
#
# Usage:
#   scripts/e2e.sh                             # runs `playwright test`
#   scripts/e2e.sh --grep "login"              # forwards flags to `playwright test`
#   scripts/e2e.sh -- playwright show-report   # runs an arbitrary command

ENV_FILE="docker/conf/.env.dev"
COMPOSE_FILE="docker/docker-compose.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE not found. Run scripts/setup-env.sh first." >&2
  exit 1
fi

# `--` marks an arbitrary command to run inside the container (bypasses the
# implicit `playwright test` wrapper). Anything else is forwarded as flags to
# `playwright test`.
if [[ "${1:-}" == "--" ]]; then
  shift
  exec docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile e2e run --rm admin-e2e "$@"
fi

if [[ $# -gt 0 ]]; then
  exec docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile e2e run --rm admin-e2e playwright test "$@"
fi

exec docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile e2e run --rm admin-e2e
