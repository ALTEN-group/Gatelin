#!/bin/bash

# Sync package-lock.json files from the dev Docker images back to the repo.
#
# The dev images run `npm i` at build time, which silently re-resolves a stale
# lock inside the image, so the lock in the repo never gets updated and CI's
# `npm ci` fails on the drift. This copies the lock each image ended up with
# (generated on Linux, like CI) back to the host, only when it differs.
# Run by start-dev.sh after `docker compose up --build`.
#
# Usage: ./scripts/sync-locks.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

COMPOSE=(docker compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev)

# service:host directory of its package-lock.json
PROJECTS=(
  "gatelin:."
  "admin:admin"
  "swagger:swagger"
  "website:website"
)

tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT
changed=0

for entry in "${PROJECTS[@]}"; do
  service="${entry%%:*}"
  dir="${entry#*:}"
  target="$dir/package-lock.json"

  image=$("${COMPOSE[@]}" images -q "$service" 2>/dev/null | head -n 1)
  if [[ -z "$image" ]]; then
    echo -e "${YELLOW}⚠${NC}  $service: no built image found, skipping $target"
    continue
  fi

  # Read from the image, not the running container: some services mount the
  # project over /usr/src/app, which would hide the lock npm produced at build.
  if ! docker run --rm --entrypoint cat "$image" /usr/src/app/package-lock.json > "$tmp" 2>/dev/null \
     || ! grep -q '"lockfileVersion"' "$tmp"; then
    echo -e "${YELLOW}⚠${NC}  $service: could not read a valid package-lock.json from the image, skipping"
    continue
  fi

  if ! cmp -s "$tmp" "$target"; then
    cp "$tmp" "$target"
    echo -e "${YELLOW}↻${NC}  $target updated from the $service image — review and commit it"
    changed=1
  fi
done

if [[ $changed -eq 0 ]]; then
  echo -e "${GREEN}✓${NC} package-lock.json files are in sync with the Docker images"
fi
