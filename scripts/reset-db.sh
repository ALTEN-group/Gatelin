#!/bin/bash

# Reset Database Script
# This script removes postgres and migration containers and cleans up the postgres volume

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🗑️  Resetting database...${NC}"

# Load environment variables
if [ -f docker/conf/.env.dev ]; then
  set -a
  source <(grep -v '^#' docker/conf/.env.dev | grep -v '^UID=')
  set +a
fi

# Set defaults if not loaded
APP_NAME=${APP_NAME:-gatelin}
ENV_NAME=${ENV_NAME:-local}

POSTGRES_CONTAINER="${APP_NAME}-postgres-${ENV_NAME}"
MIGRATION_CONTAINER="${APP_NAME}-${APP_NAME}-migration-${ENV_NAME}"
GATELIN_CONTAINER="${APP_NAME}"
VOLUME_NAME="${APP_NAME}_postgres_data"

# Stop and remove containers
echo -e "📦 Removing containers..."
docker rm -f $POSTGRES_CONTAINER 2>/dev/null && echo -e "${GREEN}✓${NC} Removed $POSTGRES_CONTAINER" || echo -e "${YELLOW}⚠${NC}  Container $POSTGRES_CONTAINER not found"
docker rm -f $MIGRATION_CONTAINER 2>/dev/null && echo -e "${GREEN}✓${NC} Removed $MIGRATION_CONTAINER" || echo -e "${YELLOW}⚠${NC}  Container $MIGRATION_CONTAINER not found"

# Remove volume
echo -e "💾 Removing volume..."
docker volume rm $VOLUME_NAME 2>/dev/null && echo -e "${GREEN}✓${NC} Removed volume $VOLUME_NAME" || echo -e "${YELLOW}⚠${NC}  Volume $VOLUME_NAME not found"

echo -e "${GREEN}✅ Database reset complete!${NC}"

# Restart all services
echo -e ""
./scripts/start-dev.sh

# Wait for services to be ready
echo -e ""
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 5

# Restart Gatelin container specifically
echo -e "🔄 Restarting Gatelin container..."
docker restart $GATELIN_CONTAINER 2>/dev/null && echo -e "${GREEN}✓${NC} Restarted $GATELIN_CONTAINER" || echo -e "${YELLOW}⚠${NC}  Container $GATELIN_CONTAINER not found"

echo -e "${GREEN}🎉 All done! Application ready with fresh database.${NC}"
