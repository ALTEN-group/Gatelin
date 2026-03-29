#!/bin/bash

export LIQUIBASE_SEARCH_PATH=/liquibase/changelog
export LIQUIBASE_COMMAND_CHANGELOG_FILE=changelog.xml

export LIQUIBASE_COMMAND_URL=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}  

export LIQUIBASE_COMMAND_REFERENCE_USERNAME=${LIQUIBASE_COMMAND_USERNAME}
export LIQUIBASE_COMMAND_REFERENCE_PASSWORD=${LIQUIBASE_COMMAND_PASSWORD}
export LIQUIBASE_COMMAND_REFERENCE_URL=${LIQUIBASE_COMMAND_URL}


date_time=$(date +"%Y-%m-%d-%T")
export LIQUIBASE_LOG_FILE="${LIQUIBASE_SEARCH_PATH}/logs/${date_time}.log"
export PGPASSWORD=${LIQUIBASE_COMMAND_PASSWORD}

function diff(){
   /liquibase/liquibase diff-changelog --url="offline:postgresql?snapshot=${SNAPSHOT}.json" --changelog-file="${LIQUIBASE_SEARCH_PATH}/versions/generated/${date_time}.sql" --diff-types="tables, views, columns, indexes, foreignkeys, primarykeys, data, trigger"
   /liquibase/liquibase changelog-sync
}

function update(){
   /liquibase/liquibase update
}

function snapshot(){
  local SNAPSHOT_NUMBER="$(( $(ls -1 ${LIQUIBASE_SEARCH_PATH}/snapshot/snapshot* | wc -l) + 1 ))"
  /liquibase/liquibase --output-file="${LIQUIBASE_SEARCH_PATH}/snapshot/snapshot${SNAPSHOT_NUMBER}.json" snapshot --snapshot-format=json
}

function rollback(){
  /liquibase/liquibase rollback-count --count=$ROLLBACK --contexts=""
}

function createUser()
{
  psql -h ${DB_HOST} -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}'" | grep -q 1 || psql -h ${DB_HOST} -d ${DB_NAME} -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PWD';"
  psql -h ${DB_HOST} -d ${DB_NAME} -c "CREATE SCHEMA IF NOT EXISTS log; \
                                      GRANT CONNECT ON DATABASE $DB_NAME TO $DB_USER; \
                                      GRANT USAGE ON SCHEMA public TO $DB_USER; \
                                      GRANT USAGE ON SCHEMA log TO $DB_USER; \
                                      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $DB_USER; \
                                      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA log TO $DB_USER; \
                                      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
                                      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA log TO $DB_USER;"
}

function createDB(){
  psql -h ${DB_HOST} -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || psql -h ${DB_HOST} -d postgres -c "CREATE DATABASE ${DB_NAME}"
}

if [[ "$1" != "history" ]] && type "$1" > /dev/null 2>&1; then
  ## First argument is an actual OS command (except if the command is history as it is a liquibase command). Run it
  exec "$@"
else
  if [[ $UPDATE = 1 ]]; then
      createDB
      update
      snapshot
      createUser
  elif [[ $ROLLBACK -gt 1 ]]; then
      rollback
      snapshot
  else 
      diff
  fi
fi
