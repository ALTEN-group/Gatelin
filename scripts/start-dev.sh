#!/bin/bash

# Start Development Environment Script
# This script starts all services using docker-compose in development mode

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting development environment...${NC}"

# Build and start services
docker compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev up --build -d

echo -e "${GREEN}✅ Development environment started!${NC}"
echo -e "Run 'docker-compose logs -f' to view logs"
