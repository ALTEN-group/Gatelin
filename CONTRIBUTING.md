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

Generate the mock auth service credentials and the matching swagger login examples:

```sh
./scripts/setup-mocks.sh
```

This generates `mocks/ms_pwd/src/data/credentials.js` and `swagger/src/gatelin.openapi.json` from their `.example` templates and fills in random passwords for the mock users. The generated passwords are printed to the console.

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

## API Fuzzing (RESTler)

[RESTler](https://github.com/microsoft/restler-fuzzer) compiles the Gatelin OpenAPI spec into a test grammar, logs in as one of the mock personas (see `swagger/src/gatelin.openapi.json` examples), and exercises every endpoint through Traefik.

run `./scripts/setup-env.sh` and `./scripts/setup-mocks.sh` first if you haven't.

```sh
./scripts/run-restler.sh            # test mode (smoketest, default)
./scripts/run-restler.sh fuzz-lean  # fuzz each endpoint once with default checkers
./scripts/run-restler.sh fuzz       # full fuzzing run ($RESTLER_TIME_BUDGET hours, default 1)
./scripts/run-restler.sh test --keep  # leave the dependency stack running afterwards
```

This starts postgres, traefik, the migration job, gatelin, and the auth/user mocks, waits for gatelin to become healthy, then runs RESTler in a container attached to the same docker network. Results (grammar, network logs, coverage, bug buckets) are written to `tests/restler/results/`.

The run fails if spec coverage drops below `RESTLER_MIN_COVERAGE` (default 50%) or if RESTler reports bugs (5xx responses or checker violations) — set `RESTLER_FAIL_ON_BUGS=false` to only report them. See `docker/restler/` for the auth module, engine settings, and pass/fail gate, and `.github/workflows/restler.yml` for the CI job (smoketest on PRs touching the spec, weekly `fuzz-lean` on schedule, or on-demand via `workflow_dispatch`).

## Production

### Images

Gatelin ships two releasable images, published to the GitHub Container Registry (GHCR) on every GitHub Release:

| Image | Description |
|---|---|
| `ghcr.io/alten-group/gatelin` | The Node.js gateway service. Also serves the Angular admin frontend under `/admin` (built into the image, enabled by setting `ADMIN_PORT`). Runs continuously as an API server. |
| `ghcr.io/alten-group/gatelin-migration` | A one-shot Liquibase container. Applies the Gatelin DB schema and core seed data, then exits. The gateway will not start until this container completes successfully. |

A third image exists for the Gatelin project itself but is not required by consumers:

| Image | Description |
|---|---|
| `dwtechs/gatelin-website` | Static documentation website. |

### Build production images

Requires `docker/conf/.env.prod` to exist. Create it by copying `.env.dev.example` and filling in production values (passwords, secrets, versions).

Builds production images from their respective `dockerfile.prod` files. Each image is tagged as `ghcr.io/alten-group/gatelin-<target>:<version>` and `ghcr.io/alten-group/gatelin-<target>:latest`, where `<version>` is read from `package.json`.

```sh
./scripts/build-prod.sh                   # build all three images
./scripts/build-prod.sh gateway           # gateway only (includes the admin UI)
./scripts/build-prod.sh migration         # migration only
./scripts/build-prod.sh website           # website only
./scripts/build-prod.sh gateway migration # multiple targets
```

### Publish to GHCR

Images are published automatically via the `.github/workflows/publish.yml` workflow when a GitHub Release is created. Publishing is scoped to the `ALTEN-group` org — `GITHUB_TOKEN` is sufficient, no PAT is needed.

Each release produces two images with the following tag variants (e.g. for `v1.2.3`):

| Tag | Example |
|---|---|
| Full semver | `1.2.3` |
| Major.minor | `1.2` |
| Major | `1` |
| Floating | `latest` |

Images include SBOM and provenance attestations (SLSA) by default.

To trigger a publish: create a Release in the GitHub UI (or via `gh release create v<version>`).

### Start production environment

Requires images to be built first (or pulled from the registry).

```sh
./scripts/start-prod.sh
```

Starts all services via `docker/docker-compose.prod.yml` using `docker/conf/.env.prod`.

### DB Migration

The `gatelin_migration` container is controlled by environment variables:

| Variable | Values | Description |
|---|---|---|
| `UPDATE` | `1` / `0` | When `1`: creates the DB, applies all schema changesets, runs consumer data (if mounted), takes a snapshot, creates the gatelin DB user. This is the normal deploy mode. When `0` (and `ROLLBACK=0`): runs a diff between the live DB and the reference snapshot, generates a `.sql` diff changelog in `versions/generated/`, and syncs the changelog. Development tool only. |
| `ROLLBACK` | integer > `1` | Rolls back the given number of changesets and takes a new snapshot. |
| `LIQUIBASE_SNAPSHOT` | integer | Index of the snapshot file to use as baseline for diff operations. |
| `LIQUIBASE_COMMAND_CONTEXTS` | e.g. `v1,oauth` | Liquibase contexts to activate during update. |

When `UPDATE=1`, the container runs the following steps in order:
1. Creates the database if it does not exist
2. Applies all baked-in schema changesets (`gateway/versions/`)
3. Applies consumer data from `/liquibase/data/changelog.xml` if the file exists
4. Takes a JSON snapshot of the current schema
5. Creates the Gatelin DB user with the correct grants

**Adding consumer app data:** Mount a folder containing a `changelog.xml` to `/liquibase/data` in the migration container. That changelog is applied after the core schema, in the same transaction scope.

```yaml
gatelin_migration:
  image: ghcr.io/alten-group/gatelin-migration:latest
  volumes:
    - ./db/gatelin/data:/liquibase/data
  environment:
    UPDATE: 1
    # ...
```
