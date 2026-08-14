#!/usr/bin/env bash
set -euo pipefail

# The admin dev server (ng serve → Vite) rebuilds on container start and can take
# 15-90s to answer 200 through Traefik. Poll before invoking Playwright so cold
# starts don't spuriously fail the first spec.

BASE_URL="${E2E_BASE_URL:-http://traefik/gatelin/}"
MAX_ATTEMPTS="${E2E_WAIT_ATTEMPTS:-45}"
SLEEP="${E2E_WAIT_INTERVAL:-2}"

printf '→ waiting for %s (max %ds)\n' "$BASE_URL" "$((MAX_ATTEMPTS * SLEEP))"

for i in $(seq 1 "$MAX_ATTEMPTS"); do
  # --fail-with-body would be nicer but curl in the Playwright image is old-ish;
  # capture the code manually and treat 2xx as ready.
  code=$(curl -o /dev/null -s -w '%{http_code}' --max-time 3 "$BASE_URL" || echo "000")
  if [[ "$code" =~ ^2 ]]; then
    printf '  ready after %ds (HTTP %s)\n' "$((i * SLEEP))" "$code"
    exec "$@"
  fi
  printf '  attempt %d/%d: HTTP %s\n' "$i" "$MAX_ATTEMPTS" "$code"
  sleep "$SLEEP"
done

echo "→ giving up. Is 'admin' up and Traefik routing to \$ADMIN_PORT?" >&2
exit 1
