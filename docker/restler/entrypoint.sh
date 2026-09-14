#!/bin/sh
# Compiles the mounted OpenAPI spec into a RESTler grammar, then runs the
# requested task (test | fuzz-lean | fuzz) against Gatelin through Traefik,
# authenticating via docker/restler/auth/refresh-token.sh.
#
# The image has no `restler` on PATH. Its exact binary name/location has
# shifted across RESTler releases (docs say /RESTler/restler/Restler, but
# that wasn't found in the pinned v9.2.4 image) — so it's located at runtime
# instead of hardcoded. If discovery fails, the /RESTler tree is dumped so
# the real layout can be read straight from the CI log.
#
# NOTE: the bug-bucket check below is well-established RESTler output
# (bug_buckets/bug_buckets.txt, only produced by fuzz/fuzz-lean, not test).
# RESTLER_MIN_COVERAGE is logged for visibility but not yet enforced — verify
# testing_summary.json's exact schema against a real run before gating on it.
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

# Prefer a native executable literally named [Rr]estler on PATH or in the
# filesystem, then any executable under a */restler/ directory (excluding our
# own mounts under /opt/restler), then the driver Restler.dll invoked via `dotnet`.
# Note: we search specifically for `restler.dll` (not `restler*.dll`) to avoid
# selecting Restler.CompilerExe.dll or Restler.Compiler.dll.
RESTLER_CMD=""
if command -v restler >/dev/null 2>&1; then
  RESTLER_CMD="restler"
else
  BIN=$(find / -maxdepth 4 -type f \( -iname 'restler' -o -iname 'restler.exe' \) -perm -u+x 2>/dev/null | grep -v '^/opt/restler' | head -1)
  if [ -z "$BIN" ]; then
    BIN=$(find / -maxdepth 4 -path '*/restler/*' -type f -perm -u+x 2>/dev/null | grep -v '^/opt/restler' | head -1)
  fi
  if [ -n "$BIN" ]; then
    RESTLER_CMD="$BIN"
  else
    DLL=$(find / -maxdepth 4 -path '*/restler/*' -type f -iname 'restler.dll' 2>/dev/null | grep -v '^/opt/restler' | head -1)
    if [ -z "$DLL" ]; then
      DLL=$(find / -maxdepth 4 -type f -iname 'restler.dll' 2>/dev/null | grep -v '^/opt/restler' | head -1)
    fi
    if [ -n "$DLL" ]; then
      RESTLER_CMD="dotnet $DLL"
    fi
  fi
fi

if [ -z "$RESTLER_CMD" ]; then
  echo "Could not locate the RESTler binary. Dumping known install roots:" >&2
  find /RESTler /restler /opt/restler_bin -maxdepth 4 2>/dev/null >&2
  exit 1
fi
echo "Using RESTler binary: ${RESTLER_CMD}"

cd "$WORK_DIR"

echo "== RESTler compile =="
$RESTLER_CMD compile --api_spec "$SPEC"

# Custom override (if provided) takes precedence; otherwise use the compiled
# default (Compile/engine_settings.json) if present.
SETTINGS_ARGS=""
if [ -f "$CUSTOM_SETTINGS" ]; then
  echo "== Using custom engine settings from docker/restler/config/engine_settings.json =="
  SETTINGS_ARGS="--settings $CUSTOM_SETTINGS"
elif [ -f "${COMPILE_DIR}/engine_settings.json" ]; then
  SETTINGS_ARGS="--settings ${COMPILE_DIR}/engine_settings.json"
fi

echo "== RESTler ${MODE} =="
set +e
$RESTLER_CMD "$MODE" \
  --grammar_file "${COMPILE_DIR}/grammar.py" \
  --dictionary_file "${COMPILE_DIR}/dict.json" \
  $SETTINGS_ARGS \
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
