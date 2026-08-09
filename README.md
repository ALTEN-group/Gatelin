# Gatelin

[![coverage](https://raw.githubusercontent.com/ALTEN-group/Gatelin/badges/badges/coverage.svg)](https://github.com/ALTEN-group/Gatelin/actions/workflows/test.yml)
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
- **Authentication** — JWT access and refresh token management
- **Authorization** — Role-based access control (RBAC) with per-route permissions
- **Session management** — Consumer sessions with automatic token refresh
- **Route management** — Applications, services, resources, routes, methods, operations
- **CORS** — Database-driven CORS origins, applied without restart
- **Admin UI** — Angular-based front-end to manage the gateway
- **Scheduled jobs** — Automatic cleanup of archived entities and old history

## Documentation

Full documentation is available at **[https://gatelin.fr](https://gatelin.fr)**.

## Quick Start

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
