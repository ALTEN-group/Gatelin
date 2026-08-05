#!/bin/bash
set -e

# Cross-platform in-place sed (GNU/Linux vs macOS BSD)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sedi() { sed -i '' "$@"; }
else
  sedi() { sed -i "$@"; }
fi

CREDENTIALS_EXAMPLE="mocks/ms_auth/src/data/credentials.example.js"
CREDENTIALS_FILE="mocks/ms_auth/src/data/credentials.js"
OPENAPI_EXAMPLE="swagger/src/gatelin.openapi.example.json"
OPENAPI_FILE="swagger/src/gatelin.openapi.json"

cp "$CREDENTIALS_EXAMPLE" "$CREDENTIALS_FILE"
cp "$OPENAPI_EXAMPLE" "$OPENAPI_FILE"

# Load MSAUTH_PWD_SECRET (used to hash mock passwords, must match the ms_auth_mock container's env)
if [[ -f docker/conf/.env.dev ]]; then
  source <(grep -v '^#' docker/conf/.env.dev | grep -v '^UID=')
fi

# @dwtechs/passken + @dwtechs/hashitaka are needed on the host to generate/hash mock passwords
npm install --prefix mocks/ms_auth --loglevel=error --no-fund

node mocks/ms_auth/scripts/generate-credentials.mjs "$CREDENTIALS_FILE" "$OPENAPI_FILE"

