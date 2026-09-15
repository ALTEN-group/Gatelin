# Contributing to Gatelin

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

## First-time Setup

Configure the development environment file with auto-generated files:

```sh
./scripts/setup-env.sh
```

This generates a `docker/conf/.env.dev` for your instance.

Start the stack:

```sh
./scripts/start-dev.sh
```

`start-dev.sh` pulls the Foxnox image (`ghcr.io/alten-group/foxnox:0.1.0-alpha.1`), waits until it is healthy, then seeds mock passwords via `POST /foxnox/` into `swagger/src/gatelin.openapi.json`. Re-run `./scripts/setup-mocks.sh` later if you want to rotate them.

Foxnox also stands in for the mid-login challenges (`POST /foxnox/challenges`,
`/foxnox/devices/verify`, `/foxnox/login-tickets/redeem` plus the matching SSR pages),
so each mock user covers one login path:

| User | Login outcome |
| --- | --- |
| `admin@example.com` | straight to a session (used by the e2e suite) |
| `standard@example.com` | straight to a session |
| `coco@example.com` | 2FA challenge, then the trusted-device prompt |
| `guest@example.com` | expired-password rotation |
| `ebuser@example.com` | rejected, account locked |

## Development

### Start

```sh
./scripts/start-dev.sh
```

Builds and starts all services via Docker Compose. Mock passwords are seeded on a fresh database automatically.

### Stop

```sh
./scripts/stop-dev.sh
```

Stops and removes all containers and the postgres volume.

```sh
./scripts/stop-dev.sh --rmi   # also remove Docker images
```

### Reset the database

Stops Gatelin and Foxnox, removes the postgres and migration containers and the postgres data volume, then restarts the stack. Migrations re-run from scratch and both services start once the new database is ready.

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

### PostgreSQL contract tests

```sh
./scripts/test-db.sh
```

Starts an isolated PostgreSQL container, applies the Liquibase changelog, and
runs every `tests/db/gatelin/*.sql` file as the application database user.
The stack and its data are removed after the run. This is a host Docker
workflow, not an npm/Jest test — do not run it from the Gatelin app container.

### Admin unit tests

```sh
cd admin
npm test                  # Vitest watch mode
npm run test:coverage     # CI / coverage
```

### Admin end-to-end tests (Playwright)

The e2e suite (`admin/e2e/`) drives the admin UI end-to-end through Traefik, logs in with a mock persona from `swagger/src/gatelin.openapi.json`, and exercises the same routing path a real browser hits (Traefik → admin → Gatelin → Foxnox / user mock).

Both flows below require:

- `./scripts/start-dev.sh` running (it seeds `swagger/src/gatelin.openapi.json` on a fresh database; the tests read those passwords via `admin/e2e/helpers/credentials.ts`).

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

## Performance Tests (k6)

[k6](https://k6.io) load-tests the API through Traefik with three scenarios: `health` (unauthenticated baseline), `login` (auth + RBAC resolution + session cache), and `resource-crud` (authenticated search/schema on `/gatelin/resources`).

Requires the development stack to be running (`./scripts/start-dev.sh`).

```sh
./scripts/run-perf.sh                      # health scenario (default)
./scripts/run-perf.sh login                # login/logout flow (auto-resets db on local)
./scripts/run-perf.sh resource-crud        # authenticated CRUD flow (auto-resets db on local)
./scripts/run-perf.sh all                  # runs all three scenarios sequentially
./scripts/run-perf.sh login --no-reset     # skip automatic local database reset
K6_VUS=50 K6_DURATION=1m ./scripts/run-perf.sh login  # override load shape
```

This runs k6 in a dedicated container attached to the internal docker network against the running stack (same way `scripts/e2e.sh` drives end-to-end tests):
- **Locally**: scenarios that write transient session data (`login`, `resource-crud`, `all`) automatically call `scripts/reset-db.sh` when done, leaving the database fresh and the stack running. Pass `--no-reset` to skip this, or `--reset-db` to force a reset on read-only scenarios.
- **In CI**: `.github/workflows/perf.yml` skips the intermediate database resets, and automatically stops and cleans up the stack at the end of the workflow via `scripts/stop-dev.sh`.

### Performance Test Reports & Results

All artifacts land on the host in `tests/perf/results/`:

- **Interactive HTML Report (`tests/perf/results/<scenario>.report.html`)**:
  A self-contained web report generated via k6's native dashboard. Includes interactive charts for request rates, p90/p95 response times, HTTP status codes, and check pass/fail ratios. Open directly in any browser:
  ```sh
  open tests/perf/results/health.report.html
  open tests/perf/results/login.report.html
  open tests/perf/results/resource-crud.report.html
  ```
- **Raw JSON Summary (`tests/perf/results/<scenario>.summary.json`)**:
  Raw metrics exported via `--summary-export` containing exact timing distributions (`p(90)`, `p(95)`, `min`, `max`, `avg`, `http_req_failed`).
- **Aggregated Benchmark Dataset (`tests/perf/results/benchmark.json`)**:
  Extracted latency and error-rate benchmarks across scenarios, formatted for continuous tracking.
- **Live Web Dashboard (`http://127.0.0.1:5665`)**:
  While a test is executing, k6 spins up a live browser dashboard on port 5665.

The run fails if a scenario's `thresholds` are breached (p95 latency, error rate — see `tests/perf/scripts/*.js`). In CI (`.github/workflows/perf.yml`), the suite runs nightly or on demand, and updates historical trend charts on the `gh-pages` branch via `benchmark-action/github-action-benchmark`.

## API Fuzzing (RESTler)

[RESTler](https://github.com/microsoft/restler-fuzzer) compiles the Gatelin OpenAPI spec into a test grammar, logs in as one of the mock personas (see `swagger/src/gatelin.openapi.json` examples), and exercises every endpoint through Traefik.

Requires the development stack to be running (`./scripts/start-dev.sh`), matching the e2e and perf test flows.

```sh
./scripts/run-restler.sh            # test mode (smoketest, default)
./scripts/run-restler.sh fuzz-lean  # fuzz each endpoint once with default checkers
./scripts/run-restler.sh fuzz       # full fuzzing run ($RESTLER_TIME_BUDGET hours, default 1)
./scripts/run-restler.sh test --no-reset  # skip automatic local database reset
```

This runs RESTler in a dedicated container attached to the internal docker network against the running stack:
- **Locally**: RESTler's fuzzing sends mutations and garbage data to endpoints, so the script automatically calls `scripts/reset-db.sh` when done to leave the database clean while keeping the stack running. Pass `--no-reset` to inspect the database after a run.
- **In CI**: `.github/workflows/restler.yml` skips the intermediate database reset, and automatically stops and cleans up the stack at the end of the workflow via `scripts/stop-dev.sh`.

Results are written to `tests/restler/results/`.

The run fails if spec coverage drops below `RESTLER_MIN_COVERAGE` (default 50%) or if RESTler reports bugs (5xx responses or checker violations) — set `RESTLER_FAIL_ON_BUGS=false` to only report them. See `docker/restler/` for the auth module, engine settings, and pass/fail gate, and `.github/workflows/restler.yml` for the CI job (smoketest on PRs touching the spec, weekly `fuzz-lean` on schedule, or on-demand via `workflow_dispatch`).

### RESTler Reports & Results

All artifacts land on the host in `tests/restler/results/` (and are published as GitHub Actions artifacts `restler-results-<mode>` in CI):

- **Run Summary (`tests/restler/results/<Mode>/ResponseBuckets/runSummary.json`)**:
  High-level JSON report aggregating executed requests, HTTP status code breakdown (`200`, `400`, `500`), error buckets, and total `bugCount`.
- **OpenAPI Spec Coverage (`tests/restler/results/<Mode>/RestlerResults/experiment*/logs/speccov.json`)**:
  Detailed specification coverage showing which API paths, HTTP methods, parameters, and response status codes were exercised. High-level numbers are also summarized in `testing_summary.json`.
- **Coverage Failures & Blocked Requests (`tests/restler/results/<Mode>/coverage_failures_to_investigate.txt`)**:
  Actionable breakdown of failing requests, sorted by the number of dependent API requests they blocked. Includes full request payloads and response bodies to help identify missing schema definitions or invalid parameter combinations in the OpenAPI spec.
- **Bug Buckets (`tests/restler/results/<Mode>/RestlerResults/experiment*/logs/bug_buckets.txt`)**:
  Generated whenever RESTler detects 5xx server errors or checker violations. Groups distinct bugs by hash, with reproduction request sequences. (File is absent or empty if 0 bugs were found).
- **Raw Network HTTP Traces (`tests/restler/results/<Mode>/RestlerResults/experiment*/logs/network.testing.*.txt`)**:
  Full chronological log of every raw HTTP request and response exchanged between RESTler, Traefik, and Gatelin.
- **Compiled Grammar & Dictionary (`tests/restler/results/Compile/`)**:
  Contains `grammar.py` (compiled Python test grammar), `dict.json` (fuzzer payload mutations), and `dependencies.json` (endpoint producer-consumer dependency graph).

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

The VitePress site (GitHub Pages) deploys on the **same event** (`.github/workflows/deploy-docs.yml`), from the tagged commit. A push to `main` does not publish docs. Use **Actions → Deploy Docs to GitHub Pages → Run workflow** for a manual rebuild.

### Maintainer weekly audit

The public weekly workflow always runs `npm audit`, Biome, outdated, and TODO scans and opens an audit issue.

Copilot CLI, APM (`apm.yml` / `apm.lock.yaml`), and `audit-fix.yml` stay in this repository so the ALTEN maintainer pipeline is versioned with the product. Those steps run only on `ALTEN-group/Gatelin` when `COPILOT_GITHUB_TOKEN` is set; forks skip them. Configure that secret (and optional `COPILOT_AUDITS_MODEL`) on the canonical repo.

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
