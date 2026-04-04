#!/bin/bash
set -e

ENV_EXAMPLE="docker/conf/.env.dev.example"
ENV_FILE="docker/conf/.env.dev"

if [ -f "$ENV_FILE" ]; then
  echo "$ENV_FILE already exists. Skipping."
  exit 0
fi

cp "$ENV_EXAMPLE" "$ENV_FILE"
echo "$ENV_FILE created from $ENV_EXAMPLE."
echo "Fill in the required values before starting the stack:"
echo "  LIQUIBASE_DB_PWD"
echo "  POSTGRES_ROOT_PWD"
echo "  GATELIN_DB_USER"
echo "  GATELIN_DB_PWD"
echo "  NPM_REGISTRY_DOMAIN        (your npm registry domain)"
echo "  NPM_REGISTRY_NODE          (your npm registry name)"
echo "  NPM_REGISTRY_URL           (your npm registry full URL)"
echo "  NPM_REGISTRY_USER          (your npm registry username / email)"
echo "  NPM_REGISTRY_TOKEN         (your npm registry API token)"
