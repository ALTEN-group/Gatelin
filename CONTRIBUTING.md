# Contributing to Gatelin

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (for running tests locally)

## First-time Setup

Copy and configure the development environment file with auto-generated secrets:

```sh
./scripts/setup-env.sh
```

This generates `docker/conf/.env.dev` from the example file and fills in random values for all passwords and secrets.

## Development

### Start

```sh
./scripts/start-dev.sh
```

Builds and starts all services (gateway, admin, postgres, migrations, mocks) via Docker Compose using `docker/conf/.env.dev`.

### Stop

```sh
./scripts/stop-dev.sh
```

Stops and removes all containers and the postgres volume.

```sh
./scripts/stop-dev.sh --rmi   # also remove Docker images
```

## Reset

### Reset the database only

Removes the postgres and migration containers and the postgres data volume. The next `start-dev.sh` will re-run all migrations from scratch.

```sh
./scripts/reset-db.sh
```

### Reset the gateway service only

Removes only the Gatelin container and image, leaving postgres and other services intact.

```sh
./scripts/reset-gatelin.sh
```

### Reset the admin frontend only

Removes the admin container, image, and node_modules volume so it rebuilds from scratch on next start.

```sh
./scripts/reset-admin.sh
```

## Tests

Run from the project root (requires `npm install` first):

```sh
npm test                  # run all tests
npm run test:watch        # watch mode
npm run test:coverage     # with coverage report
```

See [tests/README.md](tests/README.md) for more details.

## Production

### Build production images

Builds all four production images (`gateway`, `migration`, `admin`, `website`) from their respective `dockerfile.prod` files, using `docker/conf/.env.prod`. Each image is tagged as `dwtechs/gatelin-<service>:<version>` and `dwtechs/gatelin-<service>:latest`.

```sh
./scripts/build-prod.sh                   # build all images
./scripts/build-prod.sh gateway           # gateway only
./scripts/build-prod.sh migration         # migration only
./scripts/build-prod.sh admin             # admin only
./scripts/build-prod.sh website           # website only
./scripts/build-prod.sh gateway migration # multiple targets
```

### Start production environment

Requires images to be built first (or pulled from the registry).

```sh
./scripts/start-prod.sh
```

Starts all services via `docker/docker-compose.prod.yml` using `docker/conf/.env.prod`.
