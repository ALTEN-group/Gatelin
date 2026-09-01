# Environment Variables

Variables for the `gatelin` container. Required variables are validated at boot — the process refuses to start if any are missing or invalid.

## Required

| Variable | Description |
|---|---|
| `APP_NAME` | Application name used to build downstream service URLs (`{APP_NAME}-{serviceName}-{ENV_NAME}`) |
| `ENV_NAME` | Environment name, e.g. `local`, `staging`, `prod` |
| `PWD_CHECK_URL` | Credential-check endpoint of your password service. Its path is free — the mid-login endpoints are configured separately, see the [Sessions contract](./api-sessions#password-service-contract) |
| `USER_SEARCH_URL` | URL of the user microservice search endpoint (login looks up users by email) |
| `DB_HOST` | Hostname of the PostgreSQL container |
| `DB_NAME` | Database name (default: `gatelin`) |
| `DB_USER` | Database user for Gatelin request handling |
| `DB_PWD` | Database password for Gatelin |
| `DB_JOB_USER` | Database user for archive/history cron jobs (may `DELETE` catalog rows) |
| `DB_JOB_PWD` | Password for the cron database user |
| `TOKEN_SECRET` | Secret used to sign/verify JWT tokens, at least 32 characters |
| `ACCESS_TOKEN_DURATION` | Access token lifetime in seconds (default: `600`) |
| `REFRESH_TOKEN_DURATION` | Refresh token lifetime in seconds (default: `86400`) |

## Optional

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port Gatelin listens on; also used as the port in downstream service URLs |
| `SERVER_SCHEME` | `http://` | Scheme used in internal downstream URLs |
| `TZ` | — | Container timezone |
| `SESSION_RATE_LIMIT_MAX` | `20` | Max login/refresh attempts per IP per 15 minutes |
| `ADMIN_RATE_LIMIT_MAX` | `300` | Max `/gatelin/*` admin API requests per consumer per minute (IP if unauthenticated) |
| `PROXY_RATE_LIMIT_MAX` | `200` | Max proxied HTTP and WebSocket-handshake requests per consumer per minute (IP if the route is public) |
| `UPSTREAM_TIMEOUT_MS` | `30000` | Idle timeout for outbound HTTP calls to microservices. Disabled for Server-Sent Events (`Accept` or upstream `Content-Type` of `text/event-stream`). WebSocket handshake uses this value until `101`; the piped socket has no idle timeout. |
| `UPSTREAM_MAX_SOCKETS` | `256` | Max concurrent sockets per keep-alive agent (HTTP and HTTPS each). |
| `UPSTREAM_MAX_FREE_SOCKETS` | `64` | Max idle sockets retained in each keep-alive pool. |
| `REFRESH_TOKEN_COOKIE` | — | When truthy, refresh tokens are also set as an httpOnly cookie (via toker-express) |
| `REFRESH_TOKEN_COOKIE_NAME` | `refreshToken` | Name of the refresh-token cookie |
| `REFRESH_TOKEN_COOKIE_SAMESITE` | `strict` | Cookie `SameSite` (`strict`, `lax`, or `none`) |
| `REFRESH_TOKEN_COOKIE_HTTPS_ONLY` | `true` | Cookie `Secure` flag; set to `false` for plain-HTTP local stacks |
| `CSRF_COOKIE_NAME` | `csrfToken` | Name of the CSRF double-submit cookie |
| `PWD_CHALLENGES_URL` | unset (disabled) | Endpoint that mints a mid-login challenge. Empty: login continues without 2FA / password-expiry pages |
| `PWD_TRUSTED_DEVICES_URL` | unset (disabled) | Endpoint that verifies a trusted-device cookie. Empty: the cookie is ignored |
| `PWD_LOGIN_TICKET_URL` | unset (disabled) | Endpoint that redeems a login ticket. Empty: [Resume](./api-sessions#resume) answers **501** |

Each password-service endpoint is configured on its own: Gatelin never derives one URL from another, so their paths do not have to share a prefix.

## Admin UI

The Angular admin is built into the `gatelin` image and served only when `ADMIN_PORT` is set.

| Variable | Default | Description |
|---|---|---|
| `ADMIN_PORT` | unset (disabled) | Port the admin UI listens on. Unset to disable the admin UI. |
| `ADMIN_BASE_PATH` | `/admin` | Path prefix for the admin UI. Rewritten into `<base href>` at runtime — no Angular rebuild required. Must match your reverse-proxy rule. |
| `ADMIN_PASSWORD_RECOVERY_URL` | unset | When set (e.g. `/api/foxnox/web/recover`), the login page shows a “Forgotten password ?” link. Injected at runtime into `window.__GATELIN_ADMIN__` (dev entrypoint + prod `admin-server`). Leave empty to hide it. The local Compose stack’s Foxnox service serves recovery and mid-login challenge pages so you can try the link. |
| `ADMIN_SSO_TOKEN_KEY` | `sso_access_token` | localStorage key the admin UI stores the access token under. Injected at runtime like `ADMIN_PASSWORD_RECOVERY_URL`. Not app-prefixed by default so other admin UIs on the same origin can share the slot for cookie-based silent refresh — if you override it, set the same value on every app that should share that session. |

> Docker Compose examples often set `ADMIN_BASE_PATH=/gatelin`. That is an explicit override; the code default when the variable is unset remains `/admin`.

## Database migration service

These apply to the `gatelin-migration` container (`ghcr.io/alten-group/gatelin-migration`):

| Variable | Required | Description |
|---|---|---|
| `LIQUIBASE_COMMAND_USERNAME` | ✅ | PostgreSQL superuser used by Liquibase |
| `LIQUIBASE_COMMAND_PASSWORD` | ✅ | Password for the Liquibase superuser |
| `DB_HOST` | ✅ | Hostname of the PostgreSQL container |
| `DB_PORT` | ⬜ | Port of the PostgreSQL container (default: `5432`) |
| `DB_NAME` | ✅ | Database name to create and migrate |
| `DB_USER` | ✅ | Application database user to create |
| `DB_PWD` | ✅ | Password for the application database user |
| `DB_JOB_USER` | ✅ | Cron database user (may `DELETE` archived catalog rows) |
| `DB_JOB_PWD` | ✅ | Password for the cron database user |
| `UPDATE` | ✅ | Set to `1` to run the full migration |
| `ROLLBACK` | ⬜ | Number of changesets to roll back (used instead of `UPDATE`) |
| `SNAPSHOT` | ⬜ | Path to the reference snapshot file |
| `LIQUIBASE_LOG_LEVEL` | ⬜ | Liquibase log verbosity, e.g. `INFO`, `DEBUG` |
| `LIQUIBASE_COMMAND_CONTEXTS` | ⬜ | Liquibase contexts to apply during migration |
| `TZ` | ⬜ | Timezone |

## JWT & Cookie Flow

1. User logs in via `POST /gatelin/sessions` with `{ email, pwd }`.
2. Gatelin looks up the user via `USER_SEARCH_URL`, then verifies the password via `PWD_CHECK_URL` (any password service implementing the [Sessions contract](./api-sessions#password-service-contract)).
3. If the password service reports lockout, expiry, or 2FA without a trusted device, Gatelin returns **202** with `{ challengeRequired, kind, url }` instead of a session. The browser completes the challenge on the password service, comes back with `?ticket=…`, and the client calls `POST /gatelin/sessions/resume`. Services that only check passwords never trigger this step.
4. Otherwise (or after a successful resume), Gatelin issues a JWT access token (short-lived) and refresh token (long-lived), sets a CSRF cookie, and returns the session payload.
5. Client sends the access token in `Authorization: Bearer <token>` on subsequent requests.
6. When the access token expires, client calls `PUT /gatelin/sessions` with:
   - `Authorization: Bearer <access_token>` (expired tokens are accepted for refresh),
   - refresh token in the JSON body and/or cookie,
   - `X-CSRF-Token` header matching the CSRF cookie,
   - `credentials: 'include'` so cookies are sent.
7. Logout (`DELETE /gatelin/sessions`) requires the access token and CSRF header; it archives the consumer and clears cookies.

See [Sessions](./api-sessions) for the pwd-service contract and [Frontend Integration](./frontend) for the client-side challenge/resume handling.

## Maintenance Jobs

Gatelin runs two daily UTC cron jobs at startup:

| Job | Schedule | Retention |
|---|---|---|
| Delete archived entities | 02:00 UTC | Records archived for more than **2 months** |
| Delete old history | 03:00 UTC | Rows in `log.history` older than **6 months** (`tstamp` column) |

Archived entities purged: conditions (first, due to FK), then consumers, services, CORS origins, operations, resources, routes, roles, applications, scopes, and fields. Permissions are hard-deleted via the admin API and are not part of this job.
