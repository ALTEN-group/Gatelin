#!/bin/sh

export PGPASSWORD="$DB_PWD"

# function initDB(){
#     #structure
#     psql -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} -w < /opt/docker-entrypoint/sql/struct.sql

#     #insert if empty
#     insert=$(psql -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} -c "SELECT id FROM insert_control;" -tA)
#     if [[ -z $insert ]]; then
#         psql -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} -w < /opt/docker-entrypoint/sql/data.sql 
#     fi
# }

# function resetDB(){
#   # DROP SCHEMA public & login
#   psql -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} -c "DROP SCHEMA public CASCADE; DROP SCHEMA logging CASCADE;"
# }

function resetPublicFolder(){
  rm -rf ./src/public/
  cp -ar /opt/docker-entrypoint/public/ ./src/
}

function resetTemplateFolder(){
  rm -rf ./src/templates/
  cp -ar /opt/docker-entrypoint/templates/ ./src/
}


if [ $RESET_DB == 1 ]; then
  # resetDB
  resetPublicFolder
  resetTemplateFolder
fi


exec "$@"
