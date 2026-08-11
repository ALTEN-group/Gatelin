#!/bin/sh
set -e

BASE_PATH="${ADMIN_BASE_PATH:-/admin}"
BASE_PATH="${BASE_PATH%/}/"

# ng serve has no --base-href flag, so inject the runtime path into the dev "serve" config instead.
node -e '
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("angular.json", "utf8"));
config.projects.admin.architect.build.configurations.serve.baseHref = process.argv[1];
fs.writeFileSync("angular.json", JSON.stringify(config, null, 2) + "\n");
' "$BASE_PATH"

exec npm start
