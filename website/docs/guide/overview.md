# Overview

Gatelin is an API Gateway that acts as a single entry point for a microservices architecture. It handles:

- 🛣️ **Requests routing** — Dynamic route matching and forwarding to target microservices
- 👤 **Consumer management** — With automatic token refresh
- 🗺️ **Routes management** — Organize and control available API endpoints
- 🛎️ **Services management** — Register, update, and monitor backend services
- 🌐 **CORS management** — Configure and enforce Cross-Origin Resource Sharing policies
- 🔐 **Authentication** — JWT token validation, consumer session management, and mid-login challenges (2FA / expired password) delegated to the password service
- 🛡️ **Authorization** — Role-based access control (ACL) validation per route, per property, per condition
- 🎭 **Role management** — Create, update, archive, and search roles with assigned permissions
- 🔑 **Permission management** — Per-role, per-route operation access stored directly in the gateway database
- 🎛️ **Front-end admin** — Manage the entire gateway via a user-friendly web interface

## Key Concepts

### Routes

A **route** is the mapping between an incoming URL pattern and a backend microservice. Each route combines:

- a **URL pattern** to match against incoming requests,
- a **target service** and **resource** that will handle the request,
- a list of allowed **HTTP operations** (e.g. GET, POST, PUT).

When a request arrives, the gateway matches its URL against the registered routes to determine which microservice to forward it to.


### Consumers

A **consumer** represents an authenticated user session within the gateway. It is identified by a pair of JWT tokens (access token and refresh token) and linked to a user account from the user microservice. Each consumer carries an array of role IDs that determine what they are authorized to do.

Login may be interrupted by a **mid-login challenge** when the password service reports an expired password or enabled 2FA. In that case `POST /gateway/sessions` returns **202** with a challenge URL; after the user completes the workflow, the frontend redeems a one-shot ticket via `POST /gateway/sessions/resume` to create the consumer. See [Sessions](./api-sessions).

Consumers are loaded into an **in-memory cache** at startup and kept up to date on every token refresh. This makes authentication lookups fast without hitting the database on every request.

### Roles

A **role** is a named group of permissions, scoped to an application. Consumers are assigned one or more roles, and those roles define what they are allowed to access. Roles can be archived, and carry a name, description, and display color for administration purposes.

### Permissions

A **permission** is the explicit grant that links a **role** to a **route** and an **operation** (e.g. `GET /users`). It may also restrict **fields** (writable/readable columns), **scopes** (URL sub-segments), and **conditions** (row-level filters). On every incoming request, the gateway checks whether the consumer's roles include a permission that covers the matched route and HTTP method. If no matching permission exists, the request is rejected with a 403 error.

When a consumer has multiple roles, their permissions are merged.
