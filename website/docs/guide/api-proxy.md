# Proxy (Request Forwarding)

All requests not matching any `/gateway/*` route are treated as proxy requests and forwarded to the appropriate microservice based on route configuration.

## Example

```
GET /api/users/123
Authorization: Bearer <access_token>
```

**Flow:**

1. Gateway validates the route exists and matches `/api/users` pattern
2. Validates JWT token (if `jwt: true` for the route)
3. Checks consumer session exists and is valid
4. Strips the pattern from URL (if configured)
5. Forwards request to: `http://gatelin-user-development:3000/123`
6. Returns the microservice response to the client

## Health Check

```
GET /gateway/health
```

Returns the gateway service health status.
