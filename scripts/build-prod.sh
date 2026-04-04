#!/bin/bash

# Build Production Docker Image Script
# Builds a production-ready Gatelin Docker image using dockerfile.prod and docker/conf/.env.prod

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ENV_FILE="docker/conf/.env.prod"

if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ $ENV_FILE not found. Cannot build production image.${NC}"
  exit 1
fi

# Load env vars (avoid sourcing to prevent readonly variable conflicts)
get_env() { grep -E "^${1}=" "$ENV_FILE" | cut -d'=' -f2-; }

NODE_VERSION=$(get_env NODE_VERSION)
NODE_ENV=$(get_env NODE_ENV)
TZ=$(get_env TZ)
APP_UID=$(get_env UID)
APP_GID=$(get_env GID)

# Read version from package.json
VERSION=$(node -p "require('./package.json').version")

IMAGE="dwtechs/gatelin:${VERSION}"
IMAGE_LATEST="dwtechs/gatelin:latest"

echo -e "${YELLOW}🏗️  Building production image ${IMAGE}...${NC}"

docker build \
  --file dockerfile.prod \
  --build-arg NODE_VERSION="${NODE_VERSION}" \
  --build-arg NODE_ENV="${NODE_ENV}" \
  --build-arg TZ="${TZ}" \
  --build-arg UID="${APP_UID}" \
  --build-arg GID="${APP_GID}" \
  --tag "${IMAGE}" \
  --tag "${IMAGE_LATEST}" \
  .

echo -e "${GREEN}✅ Production image built: ${IMAGE}${NC}"
