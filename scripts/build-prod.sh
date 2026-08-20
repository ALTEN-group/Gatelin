#!/bin/bash

# Build Production Docker Images Script
# Builds all production-ready images using dockerfile.prod files and docker/conf/.env.prod
# Usage: ./scripts/build-prod.sh [gatelin] [migration] [website]
#   With no arguments, all images are built.
#   Note: the admin UI is built as part of the Gatelin image (see dockerfile.prod), not a separate target.

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ENV_FILE="docker/conf/.env.prod"

if [[ ! -f "$ENV_FILE" ]]; then
  echo -e "${RED}❌ $ENV_FILE not found. Cannot build production images.${NC}"
  exit 1
fi

# Load env vars (avoid sourcing to prevent readonly variable conflicts)
get_env() { grep -E "^${1}=" "$ENV_FILE" | cut -d'=' -f2-; }

NODE_VERSION=$(get_env NODE_VERSION)
NODE_ENV=$(get_env NODE_ENV)
TZ=$(get_env TZ)
APP_UID=$(get_env UID)
APP_GID=$(get_env GID)
CADDY_VERSION=$(get_env CADDY_VERSION)
LIQUIBASE_VERSION=$(get_env LIQUIBASE_VERSION)
HOME_PATH=$(get_env HOME_PATH)

# Read version from package.json
VERSION=$(node -p "require('./package.json').version")

# Determine which targets to build (default: all)
BUILD_GATELIN=false
BUILD_MIGRATION=false
BUILD_WEBSITE=false

if [[ $# -eq 0 ]]; then
  BUILD_GATELIN=true
  BUILD_MIGRATION=true
  BUILD_WEBSITE=true
else
  for arg in "$@"; do
    case "$arg" in
      gatelin)   BUILD_GATELIN=true ;;
      migration) BUILD_MIGRATION=true ;;
      website)   BUILD_WEBSITE=true ;;
      *) echo -e "${RED}❌ Unknown target: $arg (valid: gatelin, migration, website)${NC}"; exit 1 ;;
    esac
  done
fi

echo -e "${BLUE}🔖 Version: ${VERSION}${NC}"

# ─── Gatelin ────────────────────────────────────────────────────────────────
if [[ "$BUILD_GATELIN" == true ]]; then
  IMAGE="ghcr.io/alten-group/gatelin:${VERSION}"
  echo -e "${YELLOW}🏗️  Building Gatelin image ${IMAGE}...${NC}"
  docker build \
    --file dockerfile.prod \
    --build-arg NODE_VERSION="${NODE_VERSION}" \
    --build-arg NODE_ENV="${NODE_ENV}" \
    --build-arg TZ="${TZ}" \
    --build-arg UID="${APP_UID}" \
    --build-arg GID="${APP_GID}" \
    --tag "${IMAGE}" \
    --tag "ghcr.io/alten-group/gatelin:latest" \
    .
  echo -e "${GREEN}✅ Gatelin image built: ${IMAGE}${NC}"
fi

# ─── Migration ──────────────────────────────────────────────────────────────
if [[ "$BUILD_MIGRATION" == true ]]; then
  IMAGE="ghcr.io/alten-group/gatelin-migration:${VERSION}"
  echo -e "${YELLOW}🏗️  Building migration image ${IMAGE}...${NC}"
  docker build \
    --file db/liquibase/dockerfile.prod \
    --build-arg LIQUIBASE_VERSION="${LIQUIBASE_VERSION}" \
    --tag "${IMAGE}" \
    --tag "ghcr.io/alten-group/gatelin-migration:latest" \
    db/liquibase
  echo -e "${GREEN}✅ Migration image built: ${IMAGE}${NC}"
fi


# ─── Website ────────────────────────────────────────────────────────────────
if [[ "$BUILD_WEBSITE" == true ]]; then
  IMAGE="dwtechs/gatelin-website:${VERSION}"
  echo -e "${YELLOW}🏗️  Building website image ${IMAGE}...${NC}"
  docker build \
    --file website/dockerfile.prod \
    --build-arg NODE_VERSION="${NODE_VERSION}" \
    --build-arg NGINX_VERSION="${NGINX_VERSION}" \
    --build-arg TZ="${TZ}" \
    --build-arg UID="${APP_UID}" \
    --build-arg GID="${APP_GID}" \
    --tag "${IMAGE}" \
    --tag "dwtechs/gatelin-website:latest" \
    website
  echo -e "${GREEN}✅ Website image built: ${IMAGE}${NC}"
fi

echo -e "${GREEN}✅ All requested images built successfully.${NC}"
