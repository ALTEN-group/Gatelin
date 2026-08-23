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

# Optional password-recovery link and SSO storage key (empty → {}). Injected
# into index.html so the browser can read them without baking Docker env into
# the Angular bundle.
node -e '
const fs = require("fs");
const path = "src/index.html";
const url = (process.env.ADMIN_PASSWORD_RECOVERY_URL || "").trim();
const ssoTokenKey = (process.env.ADMIN_SSO_TOKEN_KEY || "").trim();
const payload = {
  ...(url ? { passwordRecoveryUrl: url } : {}),
  ...(ssoTokenKey ? { ssoTokenKey } : {}),
};
const script =
  "<script id=\"gatelin-admin-runtime\">window.__GATELIN_ADMIN__=" +
  JSON.stringify(payload) +
  ";</script>";
let html = fs.readFileSync(path, "utf8");
html = html.replace(
  /<script id="gatelin-admin-runtime">[\s\S]*?<\/script>/,
  script,
);
fs.writeFileSync(path, html);
'

exec npm start
