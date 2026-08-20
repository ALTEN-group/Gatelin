# Request Flow & Architecture

## Request Pipeline

```
Client Request
    ↓
[security] - Security headers (CSP, HSTS, X-Frame-Options, …)
    ↓
[corsMiddleware] - Origin whitelist from DB; OPTIONS → 204
    ↓
[cookieParser + /gatelin-only JSON and urlencoded parsers]
    ↓
[corsMiddleware] - Re-applied so preflight runs before route matching
    ↓
[/gatelin/health] - Liveness + DB readiness (bypasses checkRoute)
    ↓
[checkRoute] - Match request against registered DB routes
    ↓
    ├── Public login: POST /gatelin/sessions
    │     sessionLimiter (IP) → getUserByEmail → checkPwd → gateLoginChallenges
    │       ├── 202 { challengeRequired, kind, url }  (2FA / expired password)
    │       └── createTokens → session cache → 200
    │
    ├── Public resume: POST /gatelin/sessions/resume
    │     redeemLoginTicket → createTokens → session cache → 200
    │
    ├── Session refresh / logout: PUT|DELETE /gatelin/sessions
    │     JWT (+ CSRF / refresh checks) → update or archive session
    │
    ├── Admin APIs: /gatelin/*
    │     checkRequest → adminLimiter (consumer, else IP) → entity handlers
    │
    └── Proxy (catch-all)
          checkRequest → proxyLimiter (consumer, else IP) → additionalHeaders → forwardToService
          (SSE: no idle timeout; GraphQL HTTP: opaque POST/GET)

WebSocket Upgrade (HTTP server, not Express)
    ↓
corsMiddleware → checkRequest → proxyLimiter → additionalHeaders → socket pipe
```

`checkRequest` expands to:

```
parseBearer → decodeAccess → checkConsumer → checkAcl → applyAclConditions
```

Login and resume (`POST /gatelin/sessions`, `POST /gatelin/sessions/resume`) skip `checkRequest`. Every other matched request — including refresh — goes through JWT validation. Proxy-only steps (`additionalHeaders`, `forwardToService`) run only on the catch-all proxy router. Proxy request and response bodies remain streams; only `/gatelin/*` control-plane requests are parsed into `req.body`. WebSocket upgrades are authorized on the HTTP `upgrade` event and then piped; they never enter Express.

`gateLoginChallenges` reads the pwd row returned by `PWD_CHECK_URL`, enforces lockout, and may mint a challenge against the password service instead of creating a session. See [Sessions](./api-sessions#login).

## Key Middlewares

| Middleware | Role |
|---|---|
| `corsMiddleware` | Enforces the DB-backed origin whitelist; allows `Authorization` and `X-CSRF-Token` |
| `checkRoute` | Validates the request matches a configured route (required for login too) |
| `checkPwd` | Calls `PWD_CHECK_URL` and stores the public pwd row on `res.locals.pwdRow` |
| `gateLoginChallenges` | After password OK: lockout / expiry / 2FA gating; may respond `202` with a challenge URL |
| `redeemLoginTicket` | Redeems a one-shot login-resume ticket and loads the user for session creation |
| `parseBearer` / `decodeAccess` | Extract and verify the JWT access token |
| `checkConsumer` | Ensures the consumer session exists in the in-memory cache |
| `checkAcl` | Validates route/operation/scope permissions; filters writable fields only when a body was parsed (`/gatelin/*`), and resolves field/condition metadata for proxies |
| `applyAclConditions` | Injects conditions into parsed `/gatelin/*` search bodies; preserves condition metadata for proxy headers |
| `additionalHeaders` | Adds `x-consumer-user-id` / `x-consumer-name` / `x-acl-conditions` / `x-acl-fields` before forwarding |
| `checkCsrf` | Double-submit CSRF check on session refresh and logout |
| `sessionLimiter` | Caps login/refresh by IP (`SESSION_RATE_LIMIT_MAX` / 15 min) |
| `adminLimiter` / `proxyLimiter` | Caps control-plane and proxy/WS handshakes by consumer id after auth, else IP |

## Proxy ACL boundary

The data proxy is intentionally body-agnostic. Gatelin enforces route, method, scope, JWT, and permission checks before forwarding, but does not parse proxied JSON to enforce row or field rules. Protected upstream services enforce `x-acl-fields` and `x-acl-conditions`.

This split keeps HTTP forwarding transparent while retaining granular authorization:

- HTTP, GraphQL-over-HTTP, and SSE receive ACL headers on each request.
- WebSocket receives ACL headers on the upgrade handshake; frames are opaque.
- `/gatelin/*` remains fully enforced inside Gatelin because its bodies are parsed.
- Native gRPC is routed separately by Traefik/Envoy and is not handled by Gatelin.

## Production Stack

The public hostname belongs to the **edge reverse proxy**. Gatelin is the BFF behind it: `/api/*` is stripped to Gatelin’s routes (`/gatelin/*` control plane and proxied app paths). Run a **single** Gatelin process; session and ACL caches are in-memory and are not shared across replicas ([Deployment](./deployment#scaling)).

```
┌─────────────────────────────────────────────────┐
│              Edge reverse proxy                  │
│            (Traefik / nginx / Envoy)             │
│              http://your-domain.com              │
└────────────┬─────────────────────┬───────────────┘
             │                     │
   ┌─────────▼─────────┐  ┌────────▼──────────┐
   │   Admin Panel     │  │   Gatelin (BFF)   │
   │  ADMIN_BASE_PATH/*│  │   /api/*          │
   │  (default /admin) │  │   (Node.js)       │
   └─────────┬─────────┘  └────────┬──────────┘
             │                     │
             └──────────┬──────────┘
                        │
             ┌──────────▼──────────┐
             │   PostgreSQL DB     │
             │   (Gatelin data)    │
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
