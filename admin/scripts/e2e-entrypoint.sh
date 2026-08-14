#!/usr/bin/env bash
set -euo pipefail

# The admin dev server (ng serve → Vite) rebuilds on container start and can take
# 15-90s to answer 200 through Traefik. Poll before invoking Playwright so cold
# starts don't spuriously fail the first spec.

BASE_URL="${E2E_BASE_URL:-http://traefik/gatelin/}"
MAX_ATTEMPTS="${E2E_WAIT_ATTEMPTS:-45}"
SLEEP="${E2E_WAIT_INTERVAL:-2}"

dump_diagnostics() {
  echo
  echo "=========================================================================="
  echo "  DIAGNOSTICS — admin URL never returned 2xx after ${MAX_ATTEMPTS} attempts"
  echo "=========================================================================="

  echo
  echo "--- DNS resolution of key service names (from this container) ---"
  for host in traefik admin gatelin; do
    if entries=$(getent hosts "$host" 2>/dev/null); then
      echo "  $host → $entries"
    else
      echo "  $host → (not resolvable — service is not on this docker network)"
    fi
  done

  echo
  echo "--- Traefik routers (via internal API on port 8080) ---"
  # `api.insecure=true` in traefik's command means the dashboard/API is on :8080.
  if routers=$(curl -sS --max-time 5 http://traefik:8080/api/http/routers 2>&1); then
    # Compact each router to name/rule/service on one line for readability.
    echo "$routers" | python3 -c '
import json, sys
try:
    for r in json.load(sys.stdin):
        print(f"  {r.get(\"name\",\"?\"):<30}  rule={r.get(\"rule\",\"?\")}  service={r.get(\"service\",\"?\")}  status={r.get(\"status\",\"?\")}")
except Exception as e:
    print(f"  (unparseable: {e})")
    print(sys.stdin.read() if not sys.stdin.closed else "")
' 2>/dev/null || echo "$routers"
  else
    echo "  (Traefik API unreachable — is the traefik container up?)"
  fi

  echo
  echo "--- Direct probe of admin (bypass Traefik, port ${ADMIN_PORT:-4200}) ---"
  admin_probe=$(curl -sSI --max-time 5 "http://admin:${ADMIN_PORT:-4200}/" 2>&1 || true)
  echo "$admin_probe" | head -5

  echo "=========================================================================="
  echo "  Likely fixes:"
  echo "   - 'admin' unresolvable → admin container is not on the internal network"
  echo "     (probably crashed; check \`docker compose logs admin\`)."
  echo "   - No 'admin' router in Traefik → Traefik doesn't see the admin labels"
  echo "     yet. Check stack.name and traefik.enable labels."
  echo "   - Direct admin probe returns 502/refused → admin process crashed."
  echo "   - HTTP 403 through Traefik → Vite Host allowlist; add 'traefik' to"
  echo "     admin/angular.json's serve.allowedHosts."
  echo "=========================================================================="
}

printf '→ waiting for %s (max %ds)\n' "$BASE_URL" "$((MAX_ATTEMPTS * SLEEP))"

for i in $(seq 1 "$MAX_ATTEMPTS"); do
  code=$(curl -o /dev/null -s -w '%{http_code}' --max-time 3 "$BASE_URL" || echo "000")
  if [[ "$code" =~ ^2 ]]; then
    printf '  ready after %ds (HTTP %s)\n' "$((i * SLEEP))" "$code"
    exec "$@"
  fi
  printf '  attempt %d/%d: HTTP %s\n' "$i" "$MAX_ATTEMPTS" "$code"
  sleep "$SLEEP"
done

dump_diagnostics >&2
exit 1
