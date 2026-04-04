# Request Flow & Architecture

## Request Pipeline

```
Client Request
    ↓
[checkRoute] - Validate route exists and extract config
    ↓
[decodeAccess] - Decode JWT token (if present)
    ↓
[checkConsumer] - Validate consumer session
    ↓
[checkACL] - Validate user roles/permissions
    ↓
[stripUrl] - Remove pattern prefix from URL
    ↓
[additionalHeaders] - Add custom headers
    ↓
[forwardToService] - Forward to target microservice
    ↓
Client Response
```

## Key Middlewares

| Middleware | Role |
|---|---|
| `checkRoute` | Validates incoming request matches a configured route |
| `checkConsumer` | Ensures consumer session exists and is valid |
| `checkToken` | Validates JWT access and refresh tokens |
| `checkACL` | Validates user has required roles for the route |
| `stripUrl` | Removes route pattern prefix before forwarding |
| `additionalHeaders` | Adds gateway-specific headers to forwarded requests |

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
