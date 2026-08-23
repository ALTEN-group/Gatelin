#!/bin/bash
set -e

# Cross-platform in-place sed (GNU/Linux vs macOS BSD)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sedi() { sed -i '' "$@"; }
else
  sedi() { sed -i "$@"; }
fi

CREDENTIALS_EXAMPLE="mocks/ms_pwd/src/data/credentials.example.js"
CREDENTIALS_FILE="mocks/ms_pwd/src/data/credentials.js"
OPENAPI_EXAMPLE="swagger/src/gatelin.openapi.example.json"
OPENAPI_FILE="swagger/src/gatelin.openapi.json"

cp "$CREDENTIALS_EXAMPLE" "$CREDENTIALS_FILE"
cp "$OPENAPI_EXAMPLE" "$OPENAPI_FILE"

# Load MSPWD_SECRET (used to hash mock passwords, must match the ms_pwd_mock container's env)
if [[ -f docker/conf/.env.dev ]]; then
  # source <(...) process substitution failed to export vars here, so use a real temp file instead
  ENV_TMP=$(mktemp)
  grep -v '^#' docker/conf/.env.dev | grep -v '^UID=' > "$ENV_TMP"
  set -a
  source "$ENV_TMP"
  set +a
  rm -f "$ENV_TMP"
fi

# @dwtechs/passken + @dwtechs/hashitaka are needed on the host to generate/hash mock passwords
npm install --prefix mocks/ms_pwd --loglevel=error --no-fund

node mocks/ms_pwd/scripts/generate-credentials.mjs "$CREDENTIALS_FILE" "$OPENAPI_FILE"

# Restart the mock so it picks up the new credentials right away (node --watch would
# eventually reload on its own, but that races container startup / first-run setup).
if [[ -n "${MSPWD_HOST:-}" ]] && docker restart "$MSPWD_HOST" >/dev/null 2>&1; then
  echo "Restarted $MSPWD_HOST with the new credentials."
else
  echo "ms_pwd_mock container not running yet — it will pick up these credentials on next start."
fi


