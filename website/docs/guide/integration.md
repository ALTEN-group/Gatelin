# Integrating Gatelin Into Your Project

Gatelin is this application’s **Backend for Frontend**: sit it behind Traefik (or another reverse proxy) and register your services so browsers never call them directly.

This page explains how to integrate Gatelin using the published Docker images.

## 1. Project structure

Create the following directory in your project to hold your seed data:

```
my-project/
├── docker-compose.yml
└── docker/
    └── gatelin/
        └── data/             ← your seed data (CORS origins, services, roles, etc.)
            ├── changelog.xml
            └── 01-insert-cors.sql
```

The Gatelin schema itself (tables, functions, stored procedures, core bootstrap data) is **baked into the `dwtechs/gatelin-migration` image**. You do not need to copy or manage it.

## 2. Seed data volume

The `dwtechs/gatelin-migration` image mounts one optional directory:

**`/liquibase/data`** — your application-specific seed data, applied after the schema migration. Use it to insert your initial CORS origins, services, roles, permissions, etc. The migration container skips this entirely when no `changelog.xml` is found at `/liquibase/data/changelog.xml`.

Create `./docker/gatelin/data/changelog.xml` in your project:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
    http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd">

  <changeSet id="data-00" author="you">
    <comment>CORS origins for my project</comment>
    <sqlFile path="01-insert-cors.sql"/>
  </changeSet>

  <!-- add your own changesets below -->

</databaseChangeLog>
```

Then mount it in the `gatelin_migration` service:

```yaml
gatelin_migration:
  image: dwtechs/gatelin-migration:latest
  volumes:
    - ./docker/gatelin/data:/liquibase/data
```

See the [Deployment](./deployment) page for the full `docker-compose.yml` template.

## 3. Register Your Service in Gatelin

Once your service is running, use the Gatelin admin API (or admin UI) to declare its routes.

### Create an Application

```http
POST /gatelin/applications
Authorization: Bearer <access_token>

{
  "rows": [{ "name": "my-project", "description": "My project" }]
}
```

### Create a Service

The `pattern` is the URL prefix Traefik already routes to your container.

```http
POST /gatelin/services
Authorization: Bearer <access_token>

{
  "rows": [{ "name": "my-service", "pattern": "my-api" }]
}
```

### Create a Resource and Route

```http
POST /gatelin/resources
Authorization: Bearer <access_token>

{
  "rows": [{ "serviceId": <id>, "name": "users", "core": false }]
}
```

```http
POST /gatelin/routes
Authorization: Bearer <access_token>

{
  "rows": [{
    "resourceId": <id>,
    "pattern": "/(?<id>\\d+)",
    "name": "getUser",
    "description": "Get a user by ID",
    "protected": true,
    "methodIds": [1]
  }]
}
```

This registers `GET /my-api/users/123`, which Gatelin will authenticate and forward to `http://my-project-my-service-local:3000/my-api/users/123`.

## 4. Headers Injected by Gatelin

For protected routes, Gatelin decodes the JWT and injects the following headers before forwarding. Your service can read them directly, no token validation needed.

| Header | Description |
|---|---|
| `x-consumer-user-id` | ID of the authenticated user |
| `x-consumer-name` | Nickname of the authenticated user; services may map this pair to creator/updater audit context |
| `x-acl-conditions` | JSON array of `{ field, op, value }` row predicates. Allowed operators are `=`, `!=`, `<`, `>`, `<=`, `>=`. Omitted when no conditions apply. |
| `x-acl-fields` | Comma-separated column allow-list. Omitted when unrestricted (`fields` is `null`). An empty value means only `id` is allowed. |

### Enforcing ACL headers in a service

The transparent proxy does not rewrite JSON request bodies or responses. A protected upstream must treat the two ACL headers as authorization input, not informational metadata:

- **Search/list:** combine `x-acl-conditions` with caller filters using `AND`; a caller must not be able to replace or `OR` away an ACL predicate.
- **Insert:** remove fields outside `x-acl-fields`. Require inserted rows to satisfy every condition; an equality partition such as `userId = 42` may be injected server-side.
- **Update/archive/history:** verify every target ID satisfies every condition before reading or mutating it. Reject the whole operation if any target is outside the partition.
- **Response/schema/history:** project fields using `x-acl-fields`; always keep the row `id`, but never re-expose an entity's private fields.
- **Invalid headers:** fail closed. Reject malformed JSON, unknown or non-filterable condition fields, unsupported operators, and oversized condition sets.

`x-acl-fields` being absent is different from being empty. Absence means unrestricted; an empty value means no domain field is authorized.

Foxnox implements this contract in its ACL middleware and response sender and can be used as a reference.

### Trust boundary

Do not expose protected microservices directly to clients. Otherwise a caller can bypass Gatelin by omitting ACL headers. At the network layer, allow protected service traffic only from Gatelin (or from an equally trusted internal caller). Gatelin strips the client's `Authorization`, `Cookie`, and `X-CSRF-Token` — they authenticate the caller to Gatelin, not to an upstream — and replaces them with consumer/ACL context before forwarding.

For WebSocket, these headers are present only on the HTTP upgrade handshake. Frames after `101 Switching Protocols` are opaque, so message-level authorization remains the WebSocket service's responsibility.

## 5. Password service

Gatelin never stores password hashes or renders 2FA / password-rotation pages — it delegates credential checks to whatever service `PWD_CHECK_URL` points at. You have two levels of integration:

**Minimal (password check only).** Answer `POST …/pwd/compare` with 200 on a correct password and a non-2xx on a wrong one. Return a body **without** a user row (e.g. `{ "success": true }`) and Gatelin logs the user straight in — no other endpoints required. This is all you need for a plain email + password login.

**Full (mid-login challenges).** To enforce lockout, password expiry, or 2FA, make `POST …/pwd/compare` return a user row (`pwdExpiry`, `lockedUntil`, `twoFactorEnabled`) and additionally expose `POST …/pwd/challenges`, `POST …/pwd/trusted-devices/verify`, and `POST …/pwd/login-tickets/redeem` on the same host, plus the browser workflow pages that redirect back to your admin login with `?ticket=…`.

Full field-by-field shapes are in the [Sessions contract](./api-sessions#password-service-contract); client handling is in [Frontend Integration](./frontend). [Foxnox](https://github.com/dwtechs/Foxnox) is a drop-in implementation of the full contract, and the local Compose stack ships an `ms_pwd` mock that emulates it.

