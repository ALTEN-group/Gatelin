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

## 2. Register Your Service in Gatelin

Once your service is running, use the Gatelin admin API (or admin UI) to declare its routes.

### 1. Create an Application

```http
POST /gateway/applications
Authorization: Bearer <access_token>

{
  "rows": [{ "name": "my-project", "description": "My project" }]
}
```

### 2. Create a Service

The `pattern` is the URL prefix Traefik already routes to your container.

```http
POST /gateway/services
Authorization: Bearer <access_token>

{
  "rows": [{ "appId": <id>, "name": "my-service", "pattern": "my-api", "core": false }]
}
```

### 3. Create a Resource and Route

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

## 3. Headers Injected by Gatelin

For protected routes, Gatelin decodes the JWT and injects the following headers before forwarding. Your service can read them directly, no token validation needed.

| Header | Description |
|---|---|
| `x-consumer-user-id` | ID of the authenticated user |
| `x-consumer-name` | Nickname of the authenticated user |
| `x-acl-conditions` | JSON array of ACL condition values, if any apply |
