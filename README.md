# Gatelin

[![Gateway coverage](https://raw.githubusercontent.com/ALTEN-group/Gatelin/badges/badges/coverage.svg)](https://github.com/ALTEN-group/Gatelin/actions/workflows/test.yml)
[![admin coverage](https://raw.githubusercontent.com/ALTEN-group/Gatelin/badges/badges/admin-coverage.svg)](https://github.com/ALTEN-group/Gatelin/actions/workflows/test.yml)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Version](https://img.shields.io/github/v/release/ALTEN-group/Gatelin)](https://github.com/ALTEN-group/Gatelin/releases/latest)
[![Last release](https://img.shields.io/github/release-date/ALTEN-group/Gatelin)](https://github.com/ALTEN-group/Gatelin/releases/latest)

API Gateway for routing and forwarding HTTP requests to internal microservices, with JWT-based authentication, role-based access control, and a built-in admin interface.

## Images

| Image | Registry |
|---|---|
| Gateway (includes Admin UI under `/admin`) | `ghcr.io/alten-group/gatelin` |
| Migration | `ghcr.io/alten-group/gatelin-migration` |

## Features

- **Proxy** — Dynamic route matching and forwarding to target microservices
- **Authentication** — Consumer session management with JWT access and refresh token issuance, validation, and refresh
- **Authorization** — Role-based access control (RBAC/ACL) validation per route, per property, per condition...
- **Route management** — Organize and control endpoints (applications, services, resources, routes, methods, operations)
- **Role management** — Define, scope, and assign permissions to application roles
- **Permission management** — Granular operation access (GET, POST, etc.) per API, route, with optional condition and field restrictions
- **CORS management** — Control allowed origins
- **Admin UI** — Angular-based front-end to manage the entire gateway

## Documentation

Full documentation is available at **[https://gatelin.fr](https://gatelin.fr)**.

## Quick Start for off the shelf usage

Integrate Gatelin into your application using published Docker images : 
- [Integration Guide](https://gatelin.fr/guide/integration)
- [Frontend Integration Guide](https://gatelin.fr/guide/frontend)

## Quick Start for contributors

```bash
# 1. Clone the repository
git clone https://github.com/dwtechs/gatelin.git
cd gatelin

# 2. Generate the development environment file
bash scripts/setup-env.sh

# 3. Generate the mock auth credentials and swagger examples
bash scripts/setup-mocks.sh

# 4. Start the stack
bash scripts/start-dev.sh
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development workflow, testing, and production build instructions.
