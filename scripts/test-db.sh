#!/bin/bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
compose_file="$root_dir/docker/docker-compose.db-test.yml"
project_name="gatelin-db-test-$$"

cleanup() {
  docker compose --project-name "$project_name" --file "$compose_file" down --volumes --remove-orphans
}
trap cleanup EXIT

docker compose --project-name "$project_name" --file "$compose_file" up --detach --build --wait postgres
docker compose --project-name "$project_name" --file "$compose_file" run --rm --no-deps migration
docker compose --project-name "$project_name" --file "$compose_file" run --rm --no-deps db-tests
