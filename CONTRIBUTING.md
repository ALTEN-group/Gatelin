# Contributing to Gatelin

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

## First-time Setup

Configure the development environment file with auto-generated files:

```sh
./scripts/setup-env.sh
```

This generates a `docker/conf/.env.dev` for your instance.

Configure the mock pwd service and swagger login examples:

```sh
./scripts/setup-mocks.sh
```

This generates `mocks/ms_pwd/src/data/credentials.js` and `swagger/src/gatelin.openapi.json` from their `.example` templates and fills in random passwords for the mock users.

The mock also stands in for the Foxnox mid-login challenges (`POST /pwd/challenges`,
`/pwd/trusted-devices/verify`, `/pwd/login-tickets/redeem` plus the matching SSR pages),
so each mock user covers one login path:

| User | Login outcome |
| --- | --- |
| `admin@example.com` | straight to a session (used by the e2e suite) |
| `standard@example.com` | straight to a session |
| `coco@example.com` | 2FA challenge (any 6-digit code), then the trusted-device prompt |
| `guest@example.com` | expired-password rotation |
| `ebuser@example.com` | rejected, account locked |

Challenge state lives in memory, so restarting the mock container resets it.

## Development

### Start

```sh
./scripts/start-dev.sh
```

Builds and starts all services via Docker Compose.

### Stop

```sh
./scripts/stop-dev.sh
```

Stops and removes all containers and the postgres volume.

```sh
./scripts/stop-dev.sh --rmi   # also remove Docker images
```

### Reset the database

Removes the postgres and migration containers and the postgres data volume and re-run all migrations from scratch.

```sh
./scripts/reset-db.sh
```

### Reset Gatelin

Removes the Gatelin container and image and re-run the service.

```sh
./scripts/reset-gatelin.sh
```

### Reset the admin

Removes the admin container, image, and volume and rebuilds from scratch.

```sh
./scripts/reset-admin.sh
```

## Tests

Run from Gatelin service.

```sh
npm test                  # run all tests
npm run test:coverage     # with coverage report
```

### Admin unit tests

```sh
cd admin
npm test                  # Vitest watch mode
npm run test:coverage     # CI / coverage
```

### Admin end-to-end tests (Playwright)

The e2e suite (`admin/e2e/`) drives the admin UI end-to-end through Traefik, logs in with a mock persona from `swagger/src/gatelin.openapi.json`, and exercises the same routing path a real browser hits (Traefik → admin → Gatelin → mocks).

Both flows below require:

- `./scripts/start-dev.sh` running.
- `./scripts/setup-mocks.sh` executed at least once (so `swagger/src/gatelin.openapi.json` has mock passwords the tests read via `admin/e2e/helpers/credentials.ts`).

#### In Docker (recommended, no local install)

```sh
./scripts/e2e.sh                          # full suite
./scripts/e2e.sh --grep "login"           # forward flags to `playwright test`
./scripts/e2e.sh --reporter=html          # writes admin/playwright-report/
./scripts/e2e.sh -- playwright show-report  # arbitrary command after `--`
```

Runs the tests in a dedicated `admin-e2e` container (`mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble`, built from `admin/e2e-dockerfile`). The container lives behind the `e2e` Compose profile, so `docker compose up` and `start-dev.sh` deliberately skip it — it spins up on demand, runs to completion, and is removed (`--rm`). It hits Traefik over the internal Docker network at `http://traefik/gatelin/` (configurable via `ADMIN_E2E_BASE_URL` in `docker/conf/.env.dev`). Test artifacts land back on the host at `admin/test-results/` and `admin/playwright-report/`.

Pin `PLAYWRIGHT_VERSION` in `.env.dev` to whatever `admin/package.json`'s `@playwright/test` resolves to.

#### On the host (fast iteration, UI mode)

```sh
cd admin
npm run e2e:install       # once per machine — downloads Chromium
npm run e2e               # runs against Traefik on localhost:8100
npm run e2e:ui            # Playwright's interactive UI mode
```

Prefer this when iterating on a specific test — the UI mode and Playwright inspector need a display, which the containerized flow doesn't provide.

## API Fuzzing (RESTler)

[RESTler](https://github.com/microsoft/restler-fuzzer) compiles the Gatelin OpenAPI spec into a test grammar, logs in as one of the mock personas (see `swagger/src/gatelin.openapi.json` examples), and exercises every endpoint through Traefik.

run `./scripts/setup-env.sh` and `./scripts/setup-mocks.sh` first if you haven't.

```sh
./scripts/run-restler.sh            # test mode (smoketest, default)
./scripts/run-restler.sh fuzz-lean  # fuzz each endpoint once with default checkers
./scripts/run-restler.sh fuzz       # full fuzzing run ($RESTLER_TIME_BUDGET hours, default 1)
./scripts/run-restler.sh test --keep  # leave the dependency stack running afterwards
```

This starts and waits for gatelin to become healthy, then runs RESTler in a container attached to the same docker network. Results are written to `tests/restler/results/`.

The run fails if spec coverage drops below `RESTLER_MIN_COVERAGE` (default 50%) or if RESTler reports bugs (5xx responses or checker violations) — set `RESTLER_FAIL_ON_BUGS=false` to only report them. See `docker/restler/` for the auth module, engine settings, and pass/fail gate, and `.github/workflows/restler.yml` for the CI job (smoketest on PRs touching the spec, weekly `fuzz-lean` on schedule, or on-demand via `workflow_dispatch`).

## Production

### Images

Gatelin ships two releasable images, published to the GitHub Container Registry (GHCR) on every GitHub Release:

| Image | Description |
|---|---|
| `ghcr.io/alten-group/gatelin` | The Node.js BFF service. Also serves the Angular admin frontend (built into the image, enabled by setting `ADMIN_PORT`, path set via `ADMIN_BASE_PATH`, default `/gatelin`). Runs continuously as an API server. |
| `ghcr.io/alten-group/gatelin-migration` | A one-shot Liquibase container. Applies the Gatelin DB schema and core seed data, then exits. It will also apply application-specific seed data when mounted to `/liquibase/data`. |

### Build production images

Requires `docker/conf/.env.prod` to exist. Create it by copying `.env.dev.example` and filling in production values (passwords, secrets, versions).

Builds production images from their respective `dockerfile.prod` files. Each image is tagged as `ghcr.io/alten-group/gatelin-<target>:<version>` and `ghcr.io/alten-group/gatelin-<target>:latest`, where `<version>` is read from `package.json`.

```sh
./scripts/build-prod.sh                   # build all images
./scripts/build-prod.sh gatelin           # Gatelin only (includes the admin UI)
./scripts/build-prod.sh migration         # migration only
./scripts/build-prod.sh gatelin migration # multiple targets
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
2. Applies all baked-in schema changesets (`gatelin/versions/`)
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
