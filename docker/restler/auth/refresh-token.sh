#!/bin/sh
# Logs in as $RESTLER_PERSONA (a key under components.schemas.user.examples in
# the mounted OpenAPI spec — same personas swagger/CONTRIBUTING.md document)
# and prints the header RESTler injects into every fuzzed request via
# --token_refresh_command. Requires python3 + curl (present in the restler image).
set -e

SPEC_FILE="${RESTLER_SPEC_FILE:-/opt/restler/spec/gatelin.openapi.json}"
TARGET_HOST="${RESTLER_TARGET_HOST:?RESTLER_TARGET_HOST not set}"
TARGET_PORT="${RESTLER_TARGET_PORT:-80}"
PERSONA="${RESTLER_PERSONA:-gatelin_super_admin}"

CREDS=$(python3 - "$SPEC_FILE" "$PERSONA" <<'PY'
import json, sys
spec_file, persona = sys.argv[1], sys.argv[2]
with open(spec_file) as f:
    spec = json.load(f)
examples = spec["components"]["schemas"]["user"]["examples"]
if persona not in examples:
    sys.stderr.write(f"persona '{persona}' not found in {spec_file}\n")
    sys.exit(1)
value = examples[persona]["value"]
print(json.dumps({"email": value["email"], "pwd": value["pwd"]}))
PY
)

RESPONSE=$(curl -sS -X POST "http://${TARGET_HOST}:${TARGET_PORT}/api/gatelin/sessions" \
  -H "Content-Type: application/json" \
  -d "$CREDS")

TOKEN=$(printf '%s' "$RESPONSE" | python3 -c 'import json,sys
try:
    print(json.load(sys.stdin).get("accessToken", ""))
except Exception:
    print("")')

if [ -z "$TOKEN" ]; then
  echo "refresh-token.sh: login failed for persona ${PERSONA}: ${RESPONSE}" >&2
  exit 1
fi

# RESTler's token_refresh_cmd contract: a metadata line (any dict literal,
# unused here) followed by one "<header-name>: <value>" line per app.
echo "{}"
echo "Authorization: Bearer ${TOKEN}"
