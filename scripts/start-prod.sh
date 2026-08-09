#!/bin/bash

# Start Production Environment Script
# This script starts all services using docker-compose in production mode.
# Build the production image first with scripts/build-prod.sh.

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ENV_FILE="docker/conf/.env.prod"

# Read VERSION from env file
VERSION=$(grep -E "^VERSION=" "$ENV_FILE" | cut -d'=' -f2-)

if [[ -z "$VERSION" ]]; then
  echo "Error: VERSION is not set in $ENV_FILE"
  exit 1
fi

echo -e "${YELLOW}Starting production environment (gatelin:${VERSION})...${NC}"

VERSION="$VERSION" docker compose -f docker/docker-compose.prod.yml --env-file "$ENV_FILE" up -d

echo -e "${GREEN}Production environment started (gatelin:${VERSION})${NC}"
echo -e "Run 'docker compose -f docker/docker-compose.prod.yml logs -f' to view logs"
