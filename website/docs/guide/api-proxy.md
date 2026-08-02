# Proxy (Request Forwarding)

All requests not matching any `/gateway/*` route are treated as proxy requests and forwarded to the appropriate microservice based on route configuration.

## Example

```
GET /api/users/123
Authorization: Bearer <access_token>
```

**Flow:**

1. Gateway validates the route exists and matches the `/users/:id` pattern
2. Validates JWT token (if `protected: true` for the route)
3. Checks consumer session exists and is valid, and that a permission grants access
4. Injects `x-consumer-user-id` / `x-consumer-name` headers
5. Forwards the request, path and query string unchanged, to: `http://<app>-user-<env>:3000/users/123`
6. Returns the microservice response to the client

## Health Check

```
GET /gateway/health
```

Returns the gateway service health status.
