# Request Flow & Architecture

## Request Pipeline

```
Client Request
    ↓
[checkRoute] - Validate route exists and extract config
    ↓
[parseBearer] - Extract Bearer token from Authorization header
    ↓
[decodeAccess] - Decode and verify the JWT access token
    ↓
[checkConsumer] - Validate consumer session (in-memory cache)
    ↓
[checkAcl] - Validate user roles/permissions for the route
    ↓
[applyAclConditions] - Inject ACL conditions into req.body.filters
    ↓
[additionalHeaders] - Add x-consumer-* headers (proxy routes only)
    ↓
[forwardToService] - Forward to target microservice (proxy routes only)
    ↓
Client Response
```

## Key Middlewares

| Middleware | Role |
|---|---|
| `checkRoute` | Validates incoming request matches a configured route |
| `parseBearer` / `decodeAccess` | Extract and verify the JWT access token |
| `checkConsumer` | Ensures consumer session exists and is valid |
| `checkAcl` | Validates user has required roles/permissions for the route |
| `applyAclConditions` | Enforces ACL-scoped filters on search requests |
| `additionalHeaders` | Adds `x-consumer-id`/`x-consumer-name` headers before forwarding |

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
   │  /admin/*         │  │   /api/*          │
   │  (Angular SPA)    │  │   (Node.js)       │
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
