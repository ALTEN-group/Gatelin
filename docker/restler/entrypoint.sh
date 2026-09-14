#!/bin/sh
# Compiles the mounted OpenAPI spec into a RESTler grammar, then runs the
# requested task (test | fuzz-lean | fuzz) against Gatelin through Traefik,
# authenticating via docker/restler/auth/refresh-token.sh.
#
# NOTE: the bug-bucket check below is well-established RESTler output
# (bug_buckets/bug_buckets.txt). RESTLER_MIN_COVERAGE is logged for visibility
# but not yet enforced as a hard gate — RESTler's coverage summary file layout
# should be confirmed against a real v9.2.4 run before wiring a strict check.
set -e

MODE="${RESTLER_MODE:-test}"
SPEC="/opt/restler/spec/gatelin.openapi.json"
WORK_DIR="/work"
COMPILE_DIR="${WORK_DIR}/Compile"
CUSTOM_SETTINGS="/opt/restler/config/engine_settings.json"

case "$MODE" in
  test|fuzz-lean|fuzz) ;;
  *) echo "Unknown RESTLER_MODE: $MODE (expected test|fuzz-lean|fuzz)" >&2; exit 1 ;;
esac

cd "$WORK_DIR"

echo "== RESTler compile =="
restler compile --api_spec "$SPEC"

SETTINGS_FILE="${COMPILE_DIR}/engine_settings.json"
if [ -f "$CUSTOM_SETTINGS" ]; then
  echo "== Using custom engine settings from docker/restler/config/engine_settings.json =="
  SETTINGS_FILE="$CUSTOM_SETTINGS"
fi

echo "== RESTler ${MODE} =="
set +e
restler "$MODE" \
  --grammar_file "${COMPILE_DIR}/grammar.py" \
  --dictionary_file "${COMPILE_DIR}/dict.json" \
  --settings "$SETTINGS_FILE" \
  --target_ip "$RESTLER_TARGET_HOST" \
  --target_port "${RESTLER_TARGET_PORT:-80}" \
  --no_ssl \
  --token_refresh_command /opt/restler/auth/refresh-token.sh \
  --token_refresh_interval 300 \
  $( [ "$MODE" = "fuzz" ] && printf -- '--time_budget %s' "${RESTLER_TIME_BUDGET:-1}" )
RESTLER_EXIT=$?
set -e

echo "== Checking results in ${WORK_DIR} =="
BUG_BUCKETS=$(find "$WORK_DIR" -type f -name "bug_buckets.txt" | sort | tail -1)
BUGS_FOUND=false
if [ -n "$BUG_BUCKETS" ] && [ "$(wc -l < "$BUG_BUCKETS")" -gt 1 ]; then
  echo "RESTler recorded bugs in ${BUG_BUCKETS}:"
  cat "$BUG_BUCKETS"
  BUGS_FOUND=true
fi

COVERAGE_FILE=$(find "$WORK_DIR" -type f -name "speccov.json" | sort | tail -1)
if [ -n "$COVERAGE_FILE" ]; then
  echo "Spec coverage summary: ${COVERAGE_FILE} (RESTLER_MIN_COVERAGE=${RESTLER_MIN_COVERAGE:-50}, not yet enforced — see NOTE above)"
fi

if [ "$RESTLER_EXIT" -ne 0 ]; then
  echo "RESTler ${MODE} exited with code ${RESTLER_EXIT}" >&2
  exit "$RESTLER_EXIT"
fi

if [ "$BUGS_FOUND" = true ] && [ "${RESTLER_FAIL_ON_BUGS:-true}" = "true" ]; then
  echo "Failing: bugs found and RESTLER_FAIL_ON_BUGS=true" >&2
  exit 1
fi

exit 0
