#!/bin/sh

set -eu

test_count=0

for test_file in /tests/db/gatelin/*.sql; do
  if [ ! -f "$test_file" ]; then
    echo "No PostgreSQL test files found in /tests/db/gatelin" >&2
    exit 1
  fi

  echo "Running ${test_file#/tests/db/}"
  psql -X -v ON_ERROR_STOP=1 -f "$test_file"
  test_count=$((test_count + 1))
done

echo "Passed $test_count PostgreSQL test files."
