#!/bin/bash

# Reset Development Environment Script
# This script stops the dev environment, then removes the Gatelin gateway image and volume
# Usage: ./reset-dev.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Resetting development environment...${NC}"
echo -e ""

# =====================
# STOP DEV ENVIRONMENT
# =====================
./scripts/stop-dev.sh

echo -e ""

# Load environment variables
if [ -f docker/conf/.env.dev ]; then
  set -a
  source <(grep -v '^#' docker/conf/.env.dev | grep -v '^UID=')
  set +a
  echo -e "${BLUE}ℹ${NC}  Loaded environment variables from docker/conf/.env.dev"
else
  echo -e "${YELLOW}⚠${NC}  Environment file not found, using defaults"
fi

# Set defaults if not loaded
APP_NAME=${APP_NAME:-gatelin}

echo -e ""

# =====================
# REMOVE IMAGE
# =====================
echo -e "${YELLOW}🖼️  Removing Gatelin gateway image...${NC}"

GATELIN_IMAGES=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "(dwtechs/)?${APP_NAME}:" || true)

if [ -z "$GATELIN_IMAGES" ]; then
  echo -e "${YELLOW}⚠${NC}  No Gatelin gateway images found"
else
  echo "$GATELIN_IMAGES" | while read -r IMAGE; do
    docker rmi -f "$IMAGE" 2>/dev/null && echo -e "${GREEN}✓${NC} Removed image: $IMAGE" || echo -e "${RED}✗${NC} Failed to remove image: $IMAGE"
  done
fi

echo -e ""

# =====================
# REMOVE VOLUME
# =====================
echo -e "${YELLOW}💾 Removing Gatelin gateway volume...${NC}"

GATELIN_VOLUME="${APP_NAME}_gateway_node_modules"

if docker volume inspect "$GATELIN_VOLUME" >/dev/null 2>&1; then
  docker volume rm "$GATELIN_VOLUME" 2>/dev/null && echo -e "${GREEN}✓${NC} Removed volume: $GATELIN_VOLUME" || echo -e "${RED}✗${NC} Failed to remove volume: $GATELIN_VOLUME"
else
  echo -e "${YELLOW}⚠${NC}  Volume $GATELIN_VOLUME not found"
fi

echo -e ""
echo -e "${GREEN}✅ Reset complete!${NC}"
