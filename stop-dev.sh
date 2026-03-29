#!/bin/bash

# Stop Development Environment Script
# This script stops and removes all services, containers, and volumes for this project
# Usage: ./stop-dev.sh [--rmi | -i]
#   --rmi, -i : Also remove images used by services

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
REMOVE_IMAGES=false
if [[ "$1" == "--rmi" ]] || [[ "$1" == "-i" ]]; then
  REMOVE_IMAGES=true
fi

echo -e "${YELLOW}🛑 Stopping development environment...${NC}"

# Build docker compose command
COMPOSE_CMD="docker compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev down -v"

# Add --rmi flag if requested
if [ "$REMOVE_IMAGES" = true ]; then
  COMPOSE_CMD="$COMPOSE_CMD --rmi all"
  echo -e "${YELLOW}⚠️  Images will also be removed${NC}"
fi

# Execute command
eval $COMPOSE_CMD

echo -e "${RED}✅ Development environment stopped and cleaned!${NC}"
if [ "$REMOVE_IMAGES" = true ]; then
  echo -e "All containers, volumes, and images for this project have been removed."
else
  echo -e "All containers and volumes for this project have been removed."
  echo -e "Run './stop-dev.sh --rmi' to also remove images."
fi
