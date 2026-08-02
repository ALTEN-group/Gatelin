#!/bin/bash
set -e

# Cross-platform in-place sed (GNU/Linux vs macOS BSD)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sedi() { sed -i '' "$@"; }
else
  sedi() { sed -i "$@"; }
fi

CREDENTIALS_EXAMPLE="mocks/ms_auth/src/data/credentials.example.js"
CREDENTIALS_FILE="mocks/ms_auth/src/data/credentials.js"
OPENAPI_EXAMPLE="swagger/src/gatelin.openapi.example.json"
OPENAPI_FILE="swagger/src/gatelin.openapi.json"

cp "$CREDENTIALS_EXAMPLE" "$CREDENTIALS_FILE"
cp "$OPENAPI_EXAMPLE" "$OPENAPI_FILE"

# Strong random password: uppercase + lowercase + digit + special char + random hex suffix
gen_pwd() {
  echo "Aa1!$(openssl rand -hex 6)"
}

PWD_GATELIN_ADMIN=$(gen_pwd)
PWD_GATELIN_USER=$(gen_pwd)
PWD_GATELIN_SUPER_ADMIN=$(gen_pwd)
PWD_GATELIN_GUEST=$(gen_pwd)
PWD_EBOUTIQUE_USER=$(gen_pwd)
PWD_EBOUTIQUE_SUPER_ADMIN=$(gen_pwd)
PWD_EBOUTIQUE_ADMIN=$(gen_pwd)

sedi \
  -e "s|__PWD_GATELIN_ADMIN__|${PWD_GATELIN_ADMIN}|g" \
  -e "s|__PWD_GATELIN_USER__|${PWD_GATELIN_USER}|g" \
  -e "s|__PWD_GATELIN_SUPER_ADMIN__|${PWD_GATELIN_SUPER_ADMIN}|g" \
  -e "s|__PWD_GATELIN_GUEST__|${PWD_GATELIN_GUEST}|g" \
  -e "s|__PWD_EBOUTIQUE_USER__|${PWD_EBOUTIQUE_USER}|g" \
  -e "s|__PWD_EBOUTIQUE_SUPER_ADMIN__|${PWD_EBOUTIQUE_SUPER_ADMIN}|g" \
  -e "s|__PWD_EBOUTIQUE_ADMIN__|${PWD_EBOUTIQUE_ADMIN}|g" \
  "$CREDENTIALS_FILE" "$OPENAPI_FILE"

echo "$CREDENTIALS_FILE created from $CREDENTIALS_EXAMPLE."
echo "$OPENAPI_FILE created from $OPENAPI_EXAMPLE."
echo ""
echo "Auto-generated mock passwords:"
echo "  admin@example.com          = ${PWD_GATELIN_ADMIN}"
echo "  standard@example.com       = ${PWD_GATELIN_USER}"
echo "  coco@example.com           = ${PWD_GATELIN_SUPER_ADMIN}"
echo "  guest@example.com          = ${PWD_GATELIN_GUEST}"
echo "  ebuser@example.com         = ${PWD_EBOUTIQUE_USER}"
echo "  ebsuperadmin@example.com   = ${PWD_EBOUTIQUE_SUPER_ADMIN}"
echo "  ebadmin@example.com        = ${PWD_EBOUTIQUE_ADMIN}"
