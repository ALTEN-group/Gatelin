# Proxy (Request Forwarding)

Requests that match a registered route but are not handled by a `/gateway/*` admin or session router are forwarded to the target microservice. Every request still goes through `checkRoute` first — including proxied ones.

Proxied traffic is rate-limited to **200 requests per IP per minute**.

## Example

```
GET /api/users/123
Authorization: Bearer <access_token>
```

With Traefik stripping the `/api` prefix, the gateway sees `/users/123` (or whatever pattern you registered).

**Flow:**

1. Gateway validates the route exists and matches the configured pattern
2. Validates the JWT access token (if `protected: true` for the route)
3. Checks the consumer session and that a permission grants access
4. Applies ACL field filters and injects condition filters when configured
5. Injects `x-consumer-user-id`, `x-consumer-name`, and optionally `x-acl-conditions`
6. Forwards to `{SERVER_SCHEME}{APP_NAME}-{serviceName}-{ENV_NAME}:{PORT}` with the original path and query string
7. Returns the microservice response to the client

## Health Check

```
GET /gateway/health
```

Returns liveness and database readiness. This endpoint bypasses `checkRoute`.
