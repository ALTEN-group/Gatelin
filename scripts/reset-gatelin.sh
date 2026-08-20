#!/bin/bash

# Cleanup Gatelin Service Script
# This script removes only the Gatelin service container, image, and volume
# (Does not affect postgres, traefik, migration, or other services)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}🗑️  Cleaning up Gatelin service...${NC}"
echo -e ""

# Load environment variables
if [[ -f docker/conf/.env.dev ]]; then
  set -a
  source <(grep -v '^#' docker/conf/.env.dev | grep -v '^UID=')
  set +a
  echo -e "${BLUE}ℹ${NC}  Loaded environment variables from docker/conf/.env.dev"
else
  echo -e "${YELLOW}⚠${NC}  Environment file not found, using defaults"
fi

# Set defaults if not loaded
APP_NAME=${APP_NAME:-gatelin}

# Define the specific Gatelin service container name
GATELIN_CONTAINER="${APP_NAME}"

echo -e "${BLUE}ℹ${NC}  Target container: $GATELIN_CONTAINER"
echo -e ""

# =====================
# STOP AND REMOVE CONTAINER
# =====================
echo -e "${YELLOW}📦 Stopping and removing Gatelin container...${NC}"

docker rm -f "$GATELIN_CONTAINER" 2>/dev/null && echo -e "${GREEN}✓${NC} Removed container: $GATELIN_CONTAINER" || echo -e "${YELLOW}⚠${NC}  Container $GATELIN_CONTAINER not found"

echo -e ""

# =====================
# REMOVE IMAGE
# =====================
echo -e "${YELLOW}🖼️  Removing Gatelin image...${NC}"

# Look for gatelin image (dwtechs/gatelin:tag)
GATELIN_IMAGES=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "(dwtechs/)?${APP_NAME}:" || true)

if [[ -z "$GATELIN_IMAGES" ]]; then
  echo -e "${YELLOW}⚠${NC}  No Gatelin images found"
else
  echo "$GATELIN_IMAGES" | while read -r IMAGE; do
    docker rmi -f "$IMAGE" 2>/dev/null && echo -e "${GREEN}✓${NC} Removed image: $IMAGE" || echo -e "${RED}✗${NC} Failed to remove image: $IMAGE"
  done
fi

echo -e ""

# =====================
# REMOVE VOLUME
# =====================
echo -e "${YELLOW}💾 Checking for Gatelin node_modules volume...${NC}"

# Look for the specific gatelin_node_modules volume
GATELIN_VOLUME="${APP_NAME}_gatelin_node_modules"

if docker volume inspect "$GATELIN_VOLUME" >/dev/null 2>&1; then
  docker volume rm "$GATELIN_VOLUME" 2>/dev/null && echo -e "${GREEN}✓${NC} Removed volume: $GATELIN_VOLUME" || echo -e "${RED}✗${NC} Failed to remove volume: $GATELIN_VOLUME"
else
  echo -e "${YELLOW}⚠${NC}  Volume $GATELIN_VOLUME not found"
fi

echo -e ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo -e "${BLUE}ℹ${NC}  The Gatelin service container, image and volume have been removed."
echo -e "${BLUE}ℹ${NC}  Other services (postgres, traefik, etc.) remain untouched."

# Restart all services
echo -e ""
./scripts/start-dev.sh