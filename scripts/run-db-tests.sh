#!/bin/sh

set -eu

: "${PGUSER:?PGUSER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"
: "${PGUSER_JOB:?PGUSER_JOB is required}"
: "${PGPASSWORD_JOB:?PGPASSWORD_JOB is required}"

test_count=0

run_sql_dir() {
  dir="$1"
  user="$2"
  password="$3"
  role="$4"
  found=0

  for test_file in "$dir"/*.sql; do
    if [ ! -f "$test_file" ]; then
      continue
    fi
    found=1
    echo "Running ${test_file#/tests/db/} as ${role}"
    PGUSER="$user" PGPASSWORD="$password" psql -X -v ON_ERROR_STOP=1 -f "$test_file"
    test_count=$((test_count + 1))
  done

  if [ "$found" -eq 0 ]; then
    echo "No PostgreSQL test files found in ${dir}" >&2
    exit 1
  fi
}

run_sql_dir /tests/db/gatelin "$PGUSER" "$PGPASSWORD" app
run_sql_dir /tests/db/gatelin-job "$PGUSER_JOB" "$PGPASSWORD_JOB" job

echo "Passed $test_count PostgreSQL test files."
