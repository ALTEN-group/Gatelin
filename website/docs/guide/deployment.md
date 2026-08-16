# Deployment

Gatelin is distributed as Docker images on Docker Hub:

- **`dwtechs/gatelin`** — the gateway itself, also serving the Angular admin UI under a configurable base path (`ADMIN_BASE_PATH`, default `/admin`)
- **`dwtechs/gatelin-migration`** — the Liquibase migration container

See the [Integration](./integration) page for seed-data setup, and [Environment Variables](./configuration) for the full variable reference.

## Architecture

```
Browser / Client
      |
      v
  Traefik  (:80)
      |
      +-- /api/*       --> Gatelin API  (auth, routing, ACL)
      |                      (strip /api prefix → /gateway/* …)
      |
      +-- ADMIN_BASE_PATH/* --> Gatelin Admin UI
      |
      +-- /your-api/*  -->   Your microservice
```

## docker-compose.yml template

Drop this file into your project and replace the placeholder values. No Gatelin source code required — all images are pulled from Docker Hub.

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
    image: dwtechs/gatelin-migration:latest
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
    image: dwtechs/gatelin:latest
    container_name: my-project-gatelin-local
    hostname: my-project-gatelin-local
    depends_on:
      postgres:
        condition: service_healthy
      gatelin_migration:
        condition: service_completed_successfully
    environment:
      TZ: Europe/Paris
      PWD_CHECK_URL: http://my-project-mspwd-local:3000/pwd/compare
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
      - "traefik.http.routers.gateway.rule=PathPrefix(`/api`)"
      - "traefik.http.routers.gateway.entrypoints=web"
      - "traefik.http.routers.gateway.service=gateway"
      - "traefik.http.routers.gateway.middlewares=strip-prefix"
      - "traefik.http.middlewares.strip-prefix.stripprefix.prefixes=/api"
      - "traefik.http.middlewares.strip-prefix.stripprefix.forceSlash=false"
      - "traefik.http.services.gateway.loadBalancer.server.port=3000"
      - "traefik.http.routers.admin-ui.rule=PathPrefix(`/gatelin`)"
      - "traefik.http.routers.admin-ui.entrypoints=web"
      - "traefik.http.routers.admin-ui.service=admin-ui"
      - "traefik.http.services.admin-ui.loadBalancer.server.port=4200"
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
      - "stack.name=my-project-local"
      - "traefik.http.routers.my-service.rule=PathPrefix(`/my-api`)"
      - "traefik.http.routers.my-service.entrypoints=web"
      - "traefik.http.routers.my-service.service=my-service"
      - "traefik.http.services.my-service.loadbalancer.server.port=3000"

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
GET /gateway/health
```

Via Traefik (default port `8100`):

```bash
curl http://localhost:8100/api/gateway/health
```
