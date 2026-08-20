# Proxy (Request Forwarding)

Requests that match a registered route but are not handled by a `/gatelin/*` admin or session router are forwarded to the target microservice. Every request still goes through `checkRoute` first — including proxied ones.

Proxied HTTP and WebSocket handshakes are rate-limited to **`PROXY_RATE_LIMIT_MAX`** (default 200) per consumer per minute. Public routes fall back to the client IP. Login/refresh stay on a separate IP window (`SESSION_RATE_LIMIT_MAX`). Exceeded windows return **429**.

## Example

```
GET /api/users/123
Authorization: Bearer <access_token>
```

With Traefik stripping the `/api` prefix, Gatelin sees `/users/123` (or whatever pattern you registered).

**Flow:**

1. Gatelin validates the route exists and matches the configured pattern
2. Validates the JWT access token (if `protected: true` for the route)
3. Checks the consumer session and that a permission grants access
4. Checks ACL route, operation, scope, condition, and field permissions
5. Injects `x-consumer-user-id`, `x-consumer-name`, and optionally `x-acl-conditions` and `x-acl-fields`
6. Streams the request to `{SERVER_SCHEME}{APP_NAME}-{serviceName}-{ENV_NAME}:{PORT}` with the original method, path, query string, body, and safe client headers
7. Streams the microservice status, headers, and body back to the client

## Transparent forwarding

Proxy bodies are not parsed or re-serialized by Gatelin. JSON, form data, multipart uploads, binary payloads, and streaming responses pass through as bytes. Upstream response headers such as `Content-Type`, `Location`, and `Set-Cookie` are preserved.

Hop-by-hop headers are removed in both directions. The client `Authorization`, `Cookie`, and `X-CSRF-Token` request headers are also removed because they authenticate the client to Gatelin, not to an internal service. Protected services receive trusted identity and ACL context through the injected `x-consumer-*` and `x-acl-*` headers.

Because proxy bodies remain streams, Gatelin does not rewrite JSON fields or filters for proxied routes. Services must enforce the `x-acl-fields` and `x-acl-conditions` context they receive on reads, writes, history, and schema output. Gatelin's own `/gatelin/*` APIs continue to parse JSON and apply field and condition filtering internally. See [Integrating Gatelin — Enforcing ACL headers](./integration#enforcing-acl-headers-in-a-service) for the required upstream contract.

## GraphQL over HTTP

Register `/graphql` (or any path your service uses) as a normal proxied route. Queries and mutations are ordinary `POST`/`GET` HTTP bodies and now pass through as bytes. Gatelin does not parse GraphQL documents or enforce field-level GraphQL ACL; services should honor `x-acl-*` if they need row or field rules.

GraphQL subscriptions are not JSON-over-HTTP. Use [SSE](#server-sent-events) or [WebSocket](#websockets) for those transports, with the same route + JWT + ACL handshake.

## Server-Sent Events

SSE is HTTP/1.1 (`GET`, `Accept: text/event-stream` or an upstream `Content-Type: text/event-stream`). The proxy streams chunks without buffering the full body.

The generic `UPSTREAM_TIMEOUT_MS` idle timeout is **disabled** for event streams so sparse heartbeats are not killed after 30s. Disconnect when the client or upstream closes the socket. `Last-Event-ID` is a normal request header and is forwarded.

Register the SSE path as a `GET` route. ACL is checked once on the GET; Gatelin does not inspect event payloads.

## WebSockets

WebSocket `Upgrade` never enters Express. The HTTP server handles `upgrade` beside the REST pipeline:

1. Match a registered **GET** route for the path
2. Enforce CORS origin whitelist when `Origin` is present
3. Authenticate and authorize once (JWT + ACL)
4. Apply the same consumer (or IP) rate limit as the HTTP proxy
5. Inject `x-consumer-*` / `x-acl-*` on the handshake only
6. Pipe sockets after `101 Switching Protocols`

Browser `WebSocket` cannot set `Authorization`. Protected routes may pass the access token as `?access_token=` or `?token=`; Gatelin uses it for the handshake and **strips it** before contacting the upstream. Node and other clients may send `Authorization: Bearer`. Cookies and CSRF headers are not forwarded.

After `101`, frames are opaque. There is no per-message ACL.

Traefik must allow WebSockets on the route that strips `/api` and forwards to Gatelin (default in Traefik HTTP routers).

## gRPC

Native gRPC (HTTP/2, trailers, `application/grpc`) is **out of scope**. Terminate gRPC on Traefik or Envoy on a separate listener. grpc-web over HTTP/1.1 may pass as opaque bytes, but Gatelin does not implement HTTP/2 or gRPC status trailers.

## Resilience

Each proxied hop is **one attempt**. Streamed bodies cannot be replayed, so Gatelin does not retry, hedge, or trip a circuit on the data path. Unreachable upstreams return **503**; an idle timeout returns **504**.

Outbound HTTP and HTTPS use a shared keep-alive agent so sockets to internal services are reused. Cap concurrency with `UPSTREAM_MAX_SOCKETS`. Control-plane `fetch()` (password check, user search) already pools via Node/undici.

Idempotent GET retries, if you want them, belong on the client or Traefik — not in Gatelin.

## Health Check

```
GET /gatelin/health
```

Returns liveness and database readiness. This endpoint bypasses `checkRoute`.
