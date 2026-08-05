"""RESTler token-acquisition module.

Invoked periodically by the RESTler engine (see the "module" authentication
option in docker/restler/config/engine_settings.template.json). Logs in
against POST {login_url} using the credentials of one of the personas
defined as OpenAPI examples for the `user` schema in the Gatelin swagger
spec, and returns the access token formatted the way RESTler expects.

See: https://github.com/microsoft/restler-fuzzer/blob/main/docs/user-guide/Authentication.md
"""
import json

import requests


def acquire_token(data, log):
    spec_path = data["spec_path"]
    login_url = data["login_url"]
    persona = data.get("persona", "gatelin_super_admin")

    with open(spec_path, "r", encoding="utf-8") as f:
        spec = json.load(f)
    creds = spec["components"]["schemas"]["user"]["examples"][persona]["value"]

    resp = requests.post(login_url, json=creds, timeout=15)
    resp.raise_for_status()
    token = resp.json()["accessToken"]

    log(f"acquire_token: logged in as '{creds['email']}' (persona={persona})")
    # RESTler token format: a metadata line, followed by one "Header: value"
    # line per application (see Authentication.md). The metadata dict must
    # be non-empty, otherwise RESTler's engine fails with
    # "'---' is not in list" when refreshing (microsoft/restler-fuzzer#538).
    return "{'gatelin': {}}\nAuthorization: Bearer %s\n" % token
