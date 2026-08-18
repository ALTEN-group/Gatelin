# Integrating Gatelin Into Your Project

This page explains how to integrate Gatelin into your own project using the published Docker images.

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
POST /gateway/applications
Authorization: Bearer <access_token>

{
  "rows": [{ "name": "my-project", "description": "My project" }]
}
```

### Create a Service

The `pattern` is the URL prefix Traefik already routes to your container.

```http
POST /gateway/services
Authorization: Bearer <access_token>

{
  "rows": [{ "name": "my-service", "pattern": "my-api" }]
}
```

### Create a Resource and Route

```http
POST /gateway/resources
Authorization: Bearer <access_token>

{
  "rows": [{ "serviceId": <id>, "name": "users", "core": false }]
}
```

```http
POST /gateway/routes
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
| `x-consumer-name` | Nickname of the authenticated user |
| `x-acl-conditions` | JSON array of ACL condition values, if any apply |

## 5. Password service

Gatelin never stores password hashes or renders 2FA / password-rotation pages — it delegates credential checks to whatever service `PWD_CHECK_URL` points at. You have two levels of integration:

**Minimal (password check only).** Answer `POST …/pwd/compare` with 200 on a correct password and a non-2xx on a wrong one. Return a body **without** a user row (e.g. `{ "success": true }`) and Gatelin logs the user straight in — no other endpoints required. This is all you need for a plain email + password gateway.

**Full (mid-login challenges).** To enforce lockout, password expiry, or 2FA, make `POST …/pwd/compare` return a user row (`pwdExpiry`, `lockedUntil`, `twoFactorEnabled`) and additionally expose `POST …/pwd/challenges`, `POST …/pwd/trusted-devices/verify`, and `POST …/pwd/login-tickets/redeem` on the same host, plus the browser workflow pages that redirect back to your admin login with `?ticket=…`.

Full field-by-field shapes are in the [Sessions contract](./api-sessions#password-service-contract); client handling is in [Frontend Integration](./frontend). [Foxnox](https://github.com/dwtechs/Foxnox) is a drop-in implementation of the full contract, and the local Compose stack ships an `ms_pwd` mock that emulates it.

