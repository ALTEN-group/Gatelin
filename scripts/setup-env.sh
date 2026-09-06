#!/bin/bash
set -e

# Cross-platform in-place sed (GNU/Linux vs macOS BSD)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sedi() { sed -i '' "$@"; }
else
  sedi() { sed -i "$@"; }
fi

ENV_EXAMPLE="docker/conf/.env.dev.example"
ENV_FILE="docker/conf/.env.dev"

cp "$ENV_EXAMPLE" "$ENV_FILE"

# Generate random values
LIQUIBASE_DB_PWD=$(openssl rand -base64 24)
POSTGRES_ROOT_PWD=$(openssl rand -base64 24)
GATELIN_DB_USER="gatelin_$(openssl rand -hex 4)"
GATELIN_DB_PWD=$(openssl rand -base64 24)
GATELIN_DB_JOB_USER="gatelin_job_$(openssl rand -hex 4)"
GATELIN_DB_JOB_PWD=$(openssl rand -base64 24)
GATELIN_TOKEN_SECRET=$(openssl rand 48 | base64 | tr -d '\n=' | tr '+/' '-_')
FOXNOX_DB_USER="foxnox_$(openssl rand -hex 4)"
FOXNOX_DB_PWD=$(openssl rand -base64 24)
FOXNOX_DB_JOB_USER="foxnox_job_$(openssl rand -hex 4)"
FOXNOX_DB_JOB_PWD=$(openssl rand -base64 24)
FOXNOX_PWD_SECRET=$(openssl rand 48 | base64 | tr -d '\n=' | tr '+/' '-_')

sedi \
  -e "s|^LIQUIBASE_DB_PWD=.*|LIQUIBASE_DB_PWD=${LIQUIBASE_DB_PWD}|" \
  -e "s|^POSTGRES_ROOT_PWD=.*|POSTGRES_ROOT_PWD=${POSTGRES_ROOT_PWD}|" \
  -e "s|^GATELIN_DB_USER=.*|GATELIN_DB_USER=${GATELIN_DB_USER}|" \
  -e "s|^GATELIN_DB_PWD=.*|GATELIN_DB_PWD=${GATELIN_DB_PWD}|" \
  -e "s|^GATELIN_DB_JOB_USER=.*|GATELIN_DB_JOB_USER=${GATELIN_DB_JOB_USER}|" \
  -e "s|^GATELIN_DB_JOB_PWD=.*|GATELIN_DB_JOB_PWD=${GATELIN_DB_JOB_PWD}|" \
  -e "s|^GATELIN_TOKEN_SECRET=.*|GATELIN_TOKEN_SECRET=${GATELIN_TOKEN_SECRET}|" \
  -e "s|^FOXNOX_DB_USER=.*|FOXNOX_DB_USER=${FOXNOX_DB_USER}|" \
  -e "s|^FOXNOX_DB_PWD=.*|FOXNOX_DB_PWD=${FOXNOX_DB_PWD}|" \
  -e "s|^FOXNOX_DB_JOB_USER=.*|FOXNOX_DB_JOB_USER=${FOXNOX_DB_JOB_USER}|" \
  -e "s|^FOXNOX_DB_JOB_PWD=.*|FOXNOX_DB_JOB_PWD=${FOXNOX_DB_JOB_PWD}|" \
  -e "s|^FOXNOX_PWD_SECRET=.*|FOXNOX_PWD_SECRET=${FOXNOX_PWD_SECRET}|" \
  "$ENV_FILE"

# Load registry vars from the generated env file
set +e
source "$ENV_FILE" 2>/dev/null
set -e

# Build NPMRC only with non-empty values (no deprecated fields)
NPMRC_CONTENT=""
if [[ -n "$NPM_REGISTRY_URL" ]]; then
  NPMRC_CONTENT="registry=${NPM_REGISTRY_URL}"
  if [[ -n "$NPM_REGISTRY_TOKEN" ]]; then
    NPMRC_CONTENT="${NPMRC_CONTENT}
//${NPM_REGISTRY_URL}:_authToken=${NPM_REGISTRY_TOKEN}"
  fi
fi

sedi \
  -e "s|^NPMRC=.*|NPMRC=\"${NPMRC_CONTENT}\"|" \
  "$ENV_FILE"

echo "$ENV_FILE created from $ENV_EXAMPLE."
echo ""
echo "Auto-generated values:"
echo "  LIQUIBASE_DB_PWD     = ${LIQUIBASE_DB_PWD}"
echo "  POSTGRES_ROOT_PWD    = ${POSTGRES_ROOT_PWD}"
echo "  GATELIN_DB_USER      = ${GATELIN_DB_USER}"
echo "  GATELIN_DB_PWD       = ${GATELIN_DB_PWD}"
echo "  GATELIN_DB_JOB_USER  = ${GATELIN_DB_JOB_USER}"
echo "  GATELIN_DB_JOB_PWD   = ${GATELIN_DB_JOB_PWD}"
echo "  GATELIN_TOKEN_SECRET = ${GATELIN_TOKEN_SECRET}"
echo "  FOXNOX_DB_USER       = ${FOXNOX_DB_USER}"
echo "  FOXNOX_DB_PWD        = ${FOXNOX_DB_PWD}"
echo "  FOXNOX_DB_JOB_USER   = ${FOXNOX_DB_JOB_USER}"
echo "  FOXNOX_DB_JOB_PWD    = ${FOXNOX_DB_JOB_PWD}"
echo "  FOXNOX_PWD_SECRET    = ${FOXNOX_PWD_SECRET}"
echo ""
echo "Fill in the required values before starting the stack:"
echo "  NPM_REGISTRY_DOMAIN        (your npm registry domain)"
echo "  NPM_REGISTRY_NODE          (your npm registry name)"
echo "  NPM_REGISTRY_URL           (your npm registry full URL)"
echo "  NPM_REGISTRY_USER          (your npm registry username / email)"
echo "  NPM_REGISTRY_TOKEN         (your npm registry API token)"
echo ""
echo "After starting the stack, seed mock passwords with:"
echo "  ./scripts/setup-mocks.sh"
echo "(start-dev.sh also does this automatically on a fresh database.)"
