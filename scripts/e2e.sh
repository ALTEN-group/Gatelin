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

# `--no-deps`: rely on `start-dev.sh` having brought up admin/gatelin/traefik.
# Without it, `docker compose run` reconciles the dep graph on every invocation
# and can recreate already-running services when the profile scope changes,
# which on CI (cold node_modules volume) leads to admin crash-looping and
# Traefik returning 404 during the whole poll window.
COMPOSE_RUN=(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile e2e run --rm --no-deps admin-e2e)

# `--` marks an arbitrary command to run inside the container (bypasses the
# implicit `playwright test` wrapper). Anything else is forwarded as flags to
# `playwright test`.
if [[ "${1:-}" == "--" ]]; then
  shift
  exec "${COMPOSE_RUN[@]}" "$@"
fi

if [[ $# -gt 0 ]]; then
  exec "${COMPOSE_RUN[@]}" playwright test "$@"
fi

exec "${COMPOSE_RUN[@]}"
