# Overview

Gatelin is an API Gateway that acts as a single entry point for a microservices architecture. It handles:

- 🛣️ **Requests routing** — Dynamic route matching and forwarding to target microservices
- 👤 **Consumer management** — With automatic token refresh
- 🗺️ **Routes management** — Organize and control available API endpoints
- 🛎️ **Services management** — Register, update, and monitor backend services
- 🌐 **CORS management** — Configure and enforce Cross-Origin Resource Sharing policies
- 🔐 **Authentication** — JWT token validation and consumer session management
- 🛡️ **Authorization** — Role-based access control (ACL) validation per route, per property, per condition
- 🎭 **Role management** — Create, update, archive, and search roles with assigned permissions
- 🔑 **Permission management** — Per-role, per-route operation access stored directly in the gateway database
- 🎛️ **Front-end admin** — Manage the entire gateway via a user-friendly web interface
