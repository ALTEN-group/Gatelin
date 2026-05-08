# Integrating Gatelin Into Your Project

This page gives you one copy-paste `docker-compose.yml` configuration for any project that needs to plug into Gatelin.

## Architecture

```
Browser / Client
      |
      v
  Traefik  (:80)
      |
      +-- /gateway/* --> Gatelin  (auth, routing, ACL)
      |                    |
      +-- /your-api/* -->   Your microservice
```

## 1. Copy/Paste docker-compose.yml

Use this file as-is in your project. It includes `postgres`, `traefik`, `gatelin_migration`, `gatelin`, and one example service.

Place the Gatelin repository in `./gatelin` (for example with a git submodule) so build contexts resolve.

```yaml
name: my-project

services:
  postgres:
    build:
      context: ./gatelin/db/pgsql
      dockerfile: dockerfile
      args:
        - POSTGRES_VERSION=postgres:16.2-alpine3.19
    container_name: gatelin-postgres-local
    hostname: gatelin-postgres-local
    environment:
      TZ: Europe/Paris
      POSTGRES_DBS: liquibase,gatelin
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root_pwd_change_me
      #liquibase
      LIQUIBASE_USER: liquibase
      LIQUIBASE_PWD: liquibase_pwd_change_me
      # ms_gateway
      GATELIN_USER: gatelin
      GATELIN_PWD: gatelin_pwd_change_me
    networks:
      - internal
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "root", "-d", "gatelin"]
      interval: 10s
      timeout: 5s
      retries: 3

  traefik:
    image: traefik:3.6.4
    container_name: gatelin-traefik-local
    hostname: gatelin-traefik-local
    command:
      - --providers.docker=true
      - --providers.docker.network=gatelin-internal-local
      - --providers.docker.constraints=Label(`stack.name`,`gatelin-local`)
      - --entryPoints.web.address=:80
      - --providers.docker.exposedByDefault=false
      - --api.insecure=true
      - --log.level=INFO
      - --accesslog=true
    ports:
      - "8100:80"
      - "8083:8080"
    networks:
      - internal
      - external
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro

  gatelin_migration:
    build:
      context: ./gatelin/db/liquibase
      dockerfile: dockerfile
      args:
        LIQUIBASE_VERSION: 4.28.0-alpine
    container_name: gatelin-migration-local
    hostname: gatelin-migration-local
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      TZ: Europe/Paris
      LIQUIBASE_COMMAND_USERNAME: liquibase
      LIQUIBASE_COMMAND_PASSWORD: liquibase_pwd_change_me
      DB_HOST: gatelin-postgres-local
      DB_PORT: 5432
      DB_NAME: gatelin
      DB_USER: gatelin
      DB_PWD: gatelin_pwd_change_me
      UPDATE: 1
      ROLLBACK: 0
      SNAPSHOT: snapshot/snapshot1
      LIQUIBASE_LOG_LEVEL: INFO
      LIQUIBASE_COMMAND_CONTEXTS: v1,oauth
    networks:
      - internal
    volumes:
      - ./docker/gatelin/changelog:/liquibase/changelog
      - ./docker/gatelin/data:/liquibase/data

  gatelin:
    build:
      context: ./gatelin
      dockerfile: dockerfile
      args:
        UID: 1000
        GID: 1000
        TZ: Europe/Paris
        NODE_VERSION: 24.11.0-alpine3.22
        NODE_ENV: development
    image: dwtechs/gatelin:development
    container_name: gatelin-local
    hostname: gatelin-local
    depends_on:
      postgres:
        condition: service_healthy
      gatelin_migration:
        condition: service_completed_successfully
    environment:
      PORT: 3000
      TZ: Europe/Paris
      MSAUTH_VERIFY_URL: http://my-auth:3000/auth/verify
      MSUSER_SEARCH_URL: http://my-user:3000/users/users/search
      DB_HOST: gatelin-postgres-local
      DB_NAME: gatelin
      DB_USER: gatelin
      DB_PWD: gatelin_pwd_change_me
      TOKEN_SECRET: change_me_with_a_long_random_secret
      PWD_SECRET: change_me_with_a_long_random_secret
      APP_NAME: gatelin
      ENV_NAME: local
      SERVER_SCHEME: http://
      SERVICE_NAME: gatelin-local
      ACCESS_TOKEN_DURATION: 600
      REFRESH_TOKEN_DURATION: 86400
      PWD_MIN_LENGTH_POLICY: 9
      PWD_MAX_LENGTH_POLICY: 64
      PWD_NUMBERS_POLICY: true
      PWD_UPPERCASE_POLICY: false
      PWD_LOWERCASE_POLICY: true
      PWD_SYMBOLS_POLICY: true
    networks:
      - internal
    labels:
      - "traefik.enable=true"
      - "stack.name=gatelin-local"
      - "traefik.http.routers.gateway.rule=PathPrefix(`/api`)"
      - "traefik.http.routers.gateway.entrypoints=web"
      - "traefik.http.routers.gateway.service=gateway"
      - "traefik.http.routers.gateway.middlewares=strip-prefix"
      - "traefik.http.middlewares.strip-prefix.stripprefix.prefixes=/api"
      - "traefik.http.middlewares.strip-prefix.stripprefix.forceSlash=false"
      - "traefik.http.services.gateway.loadbalancer.server.port=3000"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/gateway/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  my-service:
    image: my-org/my-service:latest
    container_name: my-project-my-service-local
    hostname: my-project-my-service-local
    environment:
      PORT: 3000
      TZ: Europe/Paris
    networks:
      - internal
    labels:
      - "traefik.enable=true"
      - "stack.name=gatelin-local"
      - "traefik.http.routers.my-service.rule=PathPrefix(`/my-api`)"
      - "traefik.http.routers.my-service.entrypoints=web"
      - "traefik.http.routers.my-service.service=my-service"
      - "traefik.http.services.my-service.loadbalancer.server.port=3000"

networks:
  internal:
    name: gatelin-internal-local
    driver: bridge
  external:
    name: gatelin-external-local
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

### Recommended project structure

Both Liquibase directories are bind-mounted, so they must exist as real folders in your project and should be committed to your repository:

```
my-project/
├── docker-compose.yml
├── docker/
│   └── gatelin/
│       ├── changelog/        ← copy of gatelin/db/liquibase/gateway/ (read-only, never edit)
│       └── data/             ← your application-specific seed data
│           ├── changelog.xml
│           └── 01-insert-cors.sql
└── src/
    └── ...
```

### Liquibase volumes

`gatelin_migration` uses two mounted directories:

**`./docker/gatelin/changelog`** — the Gatelin schema **and its core bootstrap data** (built-in applications, services, routes, roles, permissions, etc. required for Gatelin itself to function). Copy it from the repository once and never edit it:

```bash
cp -r gatelin/db/liquibase/gateway ./docker/gatelin/changelog
```

**`./docker/gatelin/data`** — **your application-specific** seed data, run after the schema migration. This is where you put your own initial data: CORS origins, your services, roles, etc. `gatelin_migration` skips this entirely when `/liquibase/data/changelog.xml` is absent.

Create `./docker/gatelin/data/` with your SQL files and a `changelog.xml`:

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
| `x-consumer-id` | ID of the authenticated user |
| `x-consumer-name` | Nickname of the authenticated user |
| `x-acl-conditions` | JSON array of ACL condition values, if any apply |
