#!/bin/bash

# Start Documentation Site Script
# Starts only the VitePress website and the Traefik proxy that routes /docs to it.
# No database, API, or admin container is started.

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📚 Starting documentation site...${NC}"

# Build and start only the docs website and its proxy
docker compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev up --build -d --no-deps website traefik

# Read the published Traefik port without sourcing the env file (it defines UID=)
TRAEFIK_PORT=$(grep -E '^TRAEFIK_PORT=' docker/conf/.env.dev | cut -d= -f2)

echo -e "${GREEN}✅ Documentation site started!${NC}"
echo -e "Open http://localhost:${TRAEFIK_PORT:-80}/docs"
echo -e "Run 'docker compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev logs -f website' to view logs"
