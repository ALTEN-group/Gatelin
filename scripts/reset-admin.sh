#!/bin/bash

# Reset Admin Script
# This script removes the admin container, image, and node_modules volume
# so the admin service can be restarted from scratch

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🗑️  Resetting admin service...${NC}"
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
ENV_NAME=${ENV_NAME:-local}

ADMIN_CONTAINER="${APP_NAME}-admin-${ENV_NAME}"
ADMIN_VOLUME="${APP_NAME}_admin_node_modules"

echo -e "${BLUE}ℹ${NC}  Target container : $ADMIN_CONTAINER"
echo -e "${BLUE}ℹ${NC}  Target volume    : $ADMIN_VOLUME"
echo -e ""

# Stop and remove container
echo -e "${YELLOW}📦 Removing admin container...${NC}"
docker rm -f "$ADMIN_CONTAINER" 2>/dev/null \
  && echo -e "${GREEN}✓${NC} Removed container: $ADMIN_CONTAINER" \
  || echo -e "${YELLOW}⚠${NC}  Container $ADMIN_CONTAINER not found"

# Remove image
echo -e ""
echo -e "${YELLOW}🖼️  Removing admin image...${NC}"
ADMIN_IMAGES=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "(dwtechs/)?${APP_NAME}.*admin" || true)
if [[ -z "$ADMIN_IMAGES" ]]; then
  echo -e "${YELLOW}⚠${NC}  No admin images found"
else
  echo "$ADMIN_IMAGES" | while read -r IMAGE; do
    docker rmi -f "$IMAGE" 2>/dev/null \
      && echo -e "${GREEN}✓${NC} Removed image: $IMAGE" \
      || echo -e "${RED}✗${NC} Failed to remove image: $IMAGE"
  done
fi

# Remove dangling images left over from previous builds (<none>:<none>)
echo -e ""
echo -e "${YELLOW}🧹 Pruning dangling images...${NC}"
docker image prune -f \
  && echo -e "${GREEN}✓${NC} Dangling images pruned" \
  || echo -e "${YELLOW}⚠${NC}  Nothing to prune"

# Remove node_modules volume
echo -e ""
echo -e "${YELLOW}💾 Removing admin node_modules volume...${NC}"
docker volume rm "$ADMIN_VOLUME" 2>/dev/null \
  && echo -e "${GREEN}✓${NC} Removed volume: $ADMIN_VOLUME" \
  || echo -e "${YELLOW}⚠${NC}  Volume $ADMIN_VOLUME not found"

echo -e ""
echo -e "${GREEN}✅ Admin reset complete!${NC}"
echo -e ""

# Restart admin service
echo -e "${YELLOW}🚀 Restarting admin service...${NC}"
docker compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev up --build -d admin

echo -e ""
echo -e "${GREEN}✅ Admin service restarted!${NC}"
