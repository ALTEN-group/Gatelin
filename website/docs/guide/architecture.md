# Request Flow & Architecture

## Request Pipeline

```
Client Request
    ↓
[security] - Security headers (CSP, HSTS, X-Frame-Options, …)
    ↓
[corsMiddleware] - Origin whitelist from DB; OPTIONS → 204
    ↓
[express.json / cookieParser]
    ↓
[corsMiddleware] - Re-applied so preflight runs before route matching
    ↓
[/gateway/health] - Liveness + DB readiness (bypasses checkRoute)
    ↓
[checkRoute] - Match request against registered DB routes
    ↓
    ├── Public login: POST /gateway/sessions
    │     getUserByEmail → checkPwd → createTokens → session cache
    │
    ├── Session refresh / logout: PUT|DELETE /gateway/sessions
    │     JWT (+ CSRF / refresh checks) → update or archive session
    │
    ├── Admin APIs: /gateway/*
    │     checkRequest → entity handlers
    │
    └── Proxy (catch-all)
          checkRequest → additionalHeaders → forwardToService
```

`checkRequest` expands to:

```
parseBearer → decodeAccess → checkConsumer → checkAcl → applyAclConditions
```

Login (`POST /gateway/sessions`) skips `checkRequest`. Every other matched request — including refresh — goes through JWT validation. Proxy-only steps (`additionalHeaders`, `forwardToService`) run only on the catch-all proxy router.

## Key Middlewares

| Middleware | Role |
|---|---|
| `corsMiddleware` | Enforces the DB-backed origin whitelist; allows `Authorization` and `X-CSRF-Token` |
| `checkRoute` | Validates the request matches a configured route (required for login too) |
| `parseBearer` / `decodeAccess` | Extract and verify the JWT access token |
| `checkConsumer` | Ensures the consumer session exists in the in-memory cache |
| `checkAcl` | Validates roles/permissions; filters writable fields on protected writes |
| `applyAclConditions` | Injects ACL condition filters into `req.body.filters` (and proxy headers) |
| `additionalHeaders` | Adds `x-consumer-user-id` / `x-consumer-name` / `x-acl-conditions` before forwarding |
| `checkCsrf` | Double-submit CSRF check on session refresh and logout |

## Production Stack

```
┌─────────────────────────────────────────────────┐
│                  Reverse Proxy                   │
│                    (Traefik)                     │
│              http://your-domain.com              │
└────────────┬─────────────────────┬───────────────┘
             │                     │
   ┌─────────▼─────────┐  ┌────────▼──────────┐
   │   Admin Panel     │  │   API Gateway     │
   │  ADMIN_BASE_PATH/*│  │   /api/*          │
   │  (default /admin) │  │   (Node.js)       │
   └─────────┬─────────┘  └────────┬──────────┘
             │                     │
             └──────────┬──────────┘
                        │
             ┌──────────▼──────────┐
             │   PostgreSQL DB     │
             │   (Gateway data)    │
             └─────────────────────┘
             ┌─────────────────────┐
             │  Liquibase          │
             │  (DB Migrations)    │
             └─────────────────────┘
```

## Background Jobs

Started with the API process:

- **Delete archived entities** — daily 02:00 UTC; removes rows archived for more than 2 months
- **Delete old history** — daily 03:00 UTC; removes `log.history` rows older than 6 months
