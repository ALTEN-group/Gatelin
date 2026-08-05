#!/bin/sh
# Entrypoint for the RESTler container.
#
# Compiles the Gatelin OpenAPI spec into a RESTler grammar, then runs
# RESTler in the requested mode against the gateway reached through Traefik
# on the shared docker network, and finally checks the results.
#
# Env vars:
#   RESTLER_MODE          test | fuzz-lean | fuzz (default: test)
#   RESTLER_TARGET_HOST   hostname of the Traefik container (required)
#   RESTLER_TARGET_PORT   port Traefik listens on internally (default: 80)
#   RESTLER_PERSONA       user example key to log in with (default: gatelin_super_admin)
#   RESTLER_TIME_BUDGET   hours, only used in fuzz mode (default: 1)
#   RESTLER_MIN_COVERAGE  minimum spec coverage percentage required to pass (default: 50)
#   RESTLER_FAIL_ON_BUGS  true|false, fail the run if RESTler reports bugs (default: true)
#
# engine_settings token_refresh_interval is intentionally short (10s, not
# tied to the 10-min access token lifetime): fuzzing legitimately archives/
# deletes the consumer row backing the live session (e.g. POST
# /gateway/consumers/archive hitting id 1, the just-created login consumer),
# which permanently 401s every later request unless the auth module is
# re-invoked soon after -- a fresh login creates a new consumer row and
# recovers the session.
set -eu

RESTLER="dotnet /RESTler/restler/Restler.dll"
MODE="${RESTLER_MODE:-test}"
TARGET_HOST="${RESTLER_TARGET_HOST:?RESTLER_TARGET_HOST is required}"
TARGET_PORT="${RESTLER_TARGET_PORT:-80}"
PERSONA="${RESTLER_PERSONA:-gatelin_super_admin}"
SPEC="/opt/restler/spec/gatelin.openapi.json"
WORK="/work"

echo "== RESTler ${MODE} run against ${TARGET_HOST}:${TARGET_PORT} (persona: ${PERSONA}) =="

sed \
  -e "s#__TRAEFIK_HOST__#${TARGET_HOST}#g" \
  -e "s#__RESTLER_PERSONA__#${PERSONA}#g" \
  /opt/restler/config/engine_settings.template.json > "${WORK}/engine_settings.json"

echo "-- compiling grammar --"
${RESTLER} compile --api_spec "${SPEC}"

case "$MODE" in
  test)
    RESULT_ROOT="${WORK}/Test/RestlerResults"
    echo "-- running smoketest --"
    ${RESTLER} test \
      --grammar_file "${WORK}/Compile/grammar.py" \
      --dictionary_file "${WORK}/Compile/dict.json" \
      --settings "${WORK}/engine_settings.json" \
      --target_ip "${TARGET_HOST}" --target_port "${TARGET_PORT}" --no_ssl
    ;;
  fuzz-lean)
    RESULT_ROOT="${WORK}/FuzzLean/RestlerResults"
    echo "-- running fuzz-lean --"
    ${RESTLER} fuzz-lean \
      --grammar_file "${WORK}/Compile/grammar.py" \
      --dictionary_file "${WORK}/Compile/dict.json" \
      --settings "${WORK}/engine_settings.json" \
      --target_ip "${TARGET_HOST}" --target_port "${TARGET_PORT}" --no_ssl
    ;;
  fuzz)
    RESULT_ROOT="${WORK}/Fuzz/RestlerResults"
    echo "-- running fuzz (time_budget=${RESTLER_TIME_BUDGET:-1}h) --"
    ${RESTLER} fuzz \
      --grammar_file "${WORK}/Compile/grammar.py" \
      --dictionary_file "${WORK}/Compile/dict.json" \
      --settings "${WORK}/engine_settings.json" \
      --target_ip "${TARGET_HOST}" --target_port "${TARGET_PORT}" --no_ssl \
      --time_budget "${RESTLER_TIME_BUDGET:-1}"
    ;;
  *)
    echo "Unknown RESTLER_MODE '${MODE}' (expected test|fuzz-lean|fuzz)" >&2
    exit 1
    ;;
esac
