#!/bin/bash
set -e

ENV_EXAMPLE="docker/conf/.env.dev.example"
ENV_FILE="docker/conf/.env.dev"

cp "$ENV_EXAMPLE" "$ENV_FILE"

# Generate random values
LIQUIBASE_DB_PWD=$(openssl rand -base64 24)
POSTGRES_ROOT_PWD=$(openssl rand -base64 24)
GATELIN_DB_USER="gatelin_$(openssl rand -hex 4)"
GATELIN_DB_PWD=$(openssl rand -base64 24)

sed -i "" \
  -e "s|^LIQUIBASE_DB_PWD=.*|LIQUIBASE_DB_PWD=${LIQUIBASE_DB_PWD}|" \
  -e "s|^POSTGRES_ROOT_PWD=.*|POSTGRES_ROOT_PWD=${POSTGRES_ROOT_PWD}|" \
  -e "s|^GATELIN_DB_USER=.*|GATELIN_DB_USER=${GATELIN_DB_USER}|" \
  -e "s|^GATELIN_DB_PWD=.*|GATELIN_DB_PWD=${GATELIN_DB_PWD}|" \
  "$ENV_FILE"

echo "$ENV_FILE created from $ENV_EXAMPLE."
echo "Fill in the required values before starting the stack:"
echo "  NPM_REGISTRY_DOMAIN        (your npm registry domain)"
echo "  NPM_REGISTRY_NODE          (your npm registry name)"
echo "  NPM_REGISTRY_URL           (your npm registry full URL)"
echo "  NPM_REGISTRY_USER          (your npm registry username / email)"
echo "  NPM_REGISTRY_TOKEN         (your npm registry API token)"
