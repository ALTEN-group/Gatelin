# Deployment

Gatelin is a BFF you run behind a reverse proxy like Traefik or any another one. It is distributed as GHCR images:

- **`ghcr.io/alten-group/gatelin`** — the BFF process, also serving the Angular admin UI under a configurable base path (`ADMIN_BASE_PATH`, default `/admin`)
- **`ghcr.io/alten-group/gatelin-migration`** — the Liquibase migration container

See the [Integration](./integration) page for seed-data setup, and [Environment Variables](./configuration) for the full variable reference.

## Architecture

```
Browser / Client
      |
      v
  Traefik  (:80)   ← edge gateway (TLS, host, path)
      |
      +-- /api/*       --> Gatelin BFF  (sessions, routing, ACL)
      |                      (strip /api prefix → /gatelin/* …)
      |
      +-- ADMIN_BASE_PATH/* --> Gatelin Admin UI
      |
      +-- /api/*       -->   Gatelin --> Your microservice (internal network)
```

Protected microservices are not published through their own Traefik router. Clients must reach them through Gatelin; otherwise they could omit the trusted `x-acl-*` headers and bypass field/condition enforcement.

## Scaling

Run **one Gatelin process**. Do not set Compose/Kubernetes `replicas: 2` (or a load-balanced pool of Gatelin containers) to add capacity.

Consumer sessions, route/CORS/role caches, and rate-limit counters live **in memory on that process**. Login, refresh, and force-logout update only the instance that handled the write. A second replica will 401 a valid JWT it never cached, keep serving a token the first replica already revoked, and apply a stale ACL until restart.

Traefik **sticky sessions are not a substitute**. Token refresh, rolling deploys, and WebSocket upgrades still send the next hop to another process.

Scale the edge proxy and the upstream microservices instead. A shared session store (and shared rate-limit counters) is required before Gatelin itself can run more than one replica.

## docker-compose.yml template

Drop this file into your project and replace the placeholder values. No Gatelin source code required — all images are pulled from GHCR.

```yaml
name: my-project

services:
  postgres:
    image: postgres:16-alpine
    container_name: my-project-postgres-local
    hostname: my-project-postgres-local
    environment:
      TZ: Europe/Paris
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root_pwd_change_me
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
    container_name: my-project-traefik-local
    hostname: my-project-traefik-local
    command:
      - --providers.docker=true
      - --providers.docker.network=my-project-internal-local
      - --providers.docker.constraints=Label(`stack.name`,`my-project-local`)
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
    image: ghcr.io/alten-group/gatelin-migration:latest
    container_name: my-project-gatelin-migration-local
    hostname: my-project-gatelin-migration-local
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      TZ: Europe/Paris
      LIQUIBASE_COMMAND_USERNAME: root
      LIQUIBASE_COMMAND_PASSWORD: root_pwd_change_me
      DB_HOST: my-project-postgres-local
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
      - ./docker/gatelin/data:/liquibase/data

  gatelin:
    image: ghcr.io/alten-group/gatelin:latest
    container_name: my-project-gatelin-local
    hostname: my-project-gatelin-local
    depends_on:
      postgres:
        condition: service_healthy
      gatelin_migration:
        condition: service_completed_successfully
    environment:
      TZ: Europe/Paris
      PWD_CHECK_URL: http://my-project-foxnox-local:3000/foxnox/compare
      # Only needed when the credential check reports lockout, password expiry or 2FA
      PWD_CHALLENGES_URL: http://my-project-foxnox-local:3000/foxnox/challenges
      PWD_TRUSTED_DEVICES_URL: http://my-project-foxnox-local:3000/foxnox/devices/verify
      PWD_LOGIN_TICKET_URL: http://my-project-foxnox-local:3000/foxnox/login-tickets/redeem
      USER_SEARCH_URL: http://my-project-msuser-local:3000/users/search
      DB_HOST: my-project-postgres-local
      DB_NAME: gatelin
      DB_USER: gatelin
      DB_PWD: gatelin_pwd_change_me
      TOKEN_SECRET: change_me_with_a_long_random_secret
      APP_NAME: my-project
      ENV_NAME: local
      SERVICE_NAME: my-project-gatelin-local
      ACCESS_TOKEN_DURATION: 600
      REFRESH_TOKEN_DURATION: 86400
      REFRESH_TOKEN_COOKIE: "true"
      REFRESH_TOKEN_COOKIE_HTTPS_ONLY: "false"
      # Unset to disable the admin UI; set to enable it on a dedicated internal port
      ADMIN_PORT: 4200
      # Override the code default (/admin) to match the Traefik rule below
      ADMIN_BASE_PATH: /gatelin
    networks:
      - internal
    labels:
      - "traefik.enable=true"
      - "stack.name=my-project-local"
      - "traefik.http.routers.gatelin.rule=PathPrefix(`/api`)"
      - "traefik.http.routers.gatelin.entrypoints=web"
      - "traefik.http.routers.gatelin.service=gatelin"
      - "traefik.http.routers.gatelin.middlewares=strip-prefix"
      - "traefik.http.middlewares.strip-prefix.stripprefix.prefixes=/api"
      - "traefik.http.middlewares.strip-prefix.stripprefix.forceSlash=false"
      - "traefik.http.services.gatelin.loadBalancer.server.port=3000"
      - "traefik.http.routers.admin-ui.rule=PathPrefix(`/gatelin`)"
      - "traefik.http.routers.admin-ui.entrypoints=web"
      - "traefik.http.routers.admin-ui.service=admin-ui"
      - "traefik.http.services.admin-ui.loadBalancer.server.port=4200"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/gatelin/health"]
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
    # No Traefik labels and no published ports: protected traffic reaches this
    # service only through Gatelin on the internal Docker network.

networks:
  internal:
    name: my-project-internal-local
    driver: bridge
  external:
    name: my-project-external-local
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

## Health Check

Gatelin exposes a health endpoint:

```
GET /gatelin/health
```

Via Traefik (default port `8100`):

```bash
curl http://localhost:8100/api/gatelin/health
```
