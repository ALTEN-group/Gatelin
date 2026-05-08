# Deployment

Gatelin is distributed as Docker images on Docker Hub:

- **`dwtechs/gatelin`** — the gateway itself
- **`dwtechs/gatelin-migration`** — the Liquibase migration container

See the [Integration](./integration) page for a full `docker-compose.yml` template.

## Environment Variables

These variables must be set on the `gatelin` container:

| Variable | Required | Description |
|---|---|---|
| `MSAUTH_VERIFY_URL` | ✅ | URL of your auth microservice endpoint that verifies tokens |
| `MSUSER_SEARCH_URL` | ✅ | URL of your user microservice endpoint that searches users |
| `TOKEN_SECRET` | ✅ | Secret used to verify JWT access tokens (must match your auth service) |
| `PWD_SECRET` | ✅ | Secret used to verify password hashes (must match your auth service) |
| `DB_HOST` | ✅ | Hostname of the PostgreSQL container |
| `DB_NAME` | ✅ | Database name (default: `gatelin`) |
| `DB_USER` | ✅ | Database user for Gatelin |
| `DB_PWD` | ✅ | Database password for Gatelin |
| `APP_NAME` | ✅ | Application name, used to name the Docker network (`APP_NAME-internal-ENV_NAME`) |
| `ENV_NAME` | ✅ | Environment name, e.g. `local`, `staging`, `prod` |
| `SERVER_SCHEME` | ✅ | Scheme used in internal URLs, e.g. `http://` |
| `SERVICE_NAME` | ✅ | Container hostname of the Gatelin service |
| `PORT` | ✅ | Port Gatelin listens on (default: `3000`) |
| `ACCESS_TOKEN_DURATION` | ✅ | Access token lifetime in seconds (default: `600`) |
| `REFRESH_TOKEN_DURATION` | ✅ | Refresh token lifetime in seconds (default: `86400`) |
| `TZ` | ✅ | Timezone, e.g. `Europe/Paris` |
| `PWD_MIN_LENGTH_POLICY` | | Minimum password length (default: `9`) |
| `PWD_MAX_LENGTH_POLICY` | | Maximum password length (default: `64`) |
| `PWD_NUMBERS_POLICY` | | Require numbers in password (default: `true`) |
| `PWD_UPPERCASE_POLICY` | | Require uppercase in password (default: `false`) |
| `PWD_LOWERCASE_POLICY` | | Require lowercase in password (default: `true`) |
| `PWD_SYMBOLS_POLICY` | | Require symbols in password (default: `true`) |

## Health Check

Gatelin exposes a health endpoint:

```
GET /gateway/health
```

Via Traefik (default port `8100`):

```bash
curl http://localhost:8100/api/gateway/health
```