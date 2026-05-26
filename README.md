# Gatelin

API Gateway for routing and forwarding HTTP requests to internal microservices, with JWT-based authentication, role-based access control, and a built-in admin interface.

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

# 3. Start the stack
bash scripts/start-dev.sh
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development workflow, testing, and production build instructions.

## License

[MIT](LICENSE) © 2025 DWTechs
