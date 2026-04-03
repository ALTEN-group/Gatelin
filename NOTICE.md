# Gatelin

## setup-env.sh Script

The `setup-env.sh` script creates your local environment file from the committed template. It must be run once after cloning the repository, before starting the development environment.

### What It Does

1. **Copies** `docker/conf/.env.dev.example` to `docker/conf/.env.dev`
2. **Skips** if `docker/conf/.env.dev` already exists

`docker/conf/.env.dev` is gitignored and never committed. The example file contains all variables with sensitive values left blank.

### When to Use It

Run this script:
- After cloning the repository for the first time
- When a new environment variable has been added to `.env.dev.example`

### How to Run

```bash
./setup-env.sh
```

### After Running

Fill in the sensitive values in `docker/conf/.env.dev`:
- `LIQUIBASE_DB_PWD`
- `POSTGRES_ROOT_PWD`
- `GATELIN_DB_USER`
- `GATELIN_DB_PWD`
- `NPM_REGISTRY_DOMAIN`
- `NPM_REGISTRY_NODE`
- `NPM_REGISTRY_URL`
- `NPM_REGISTRY_USER`
- `NPM_REGISTRY_TOKEN`

Then start the development environment with `./start-dev.sh`.

---

## start-dev.sh Script

The `start-dev.sh` script is a convenience utility for quickly starting the development environment with a single command. It builds and runs all services using docker-compose.

### What It Does

1. **Builds** all Docker images (if changes detected)
2. **Starts** all services defined in `docker/docker-compose.yml`
3. **Loads** environment variables from `docker/conf/.env.dev`
4. **Runs** in detached mode (background)

### When to Use It

Use this script when you need to:
- Start your local development environment
- Start working after cloning the repository
- Restart services after making changes
- Quickly spin up all containers

### How to Run

```bash
./start-dev.sh
```

### After Running

After starting the environment:
- Services run in the background (detached mode)
- Use `docker-compose logs -f` to view live logs
- Use `docker ps` to see running containers
- Services are accessible on their configured ports

---

## reset-db.sh Script

The `reset-db.sh` script is a utility for completely resetting the database during development. It removes all Docker containers and volumes related to the database, giving you a fresh start.

### What It Does

1. **Loads environment variables** from `docker/conf/.env.dev` (or uses defaults)
2. **Stops and removes** the PostgreSQL container (`gatelin-postgres-local`)
3. **Stops and removes** the Liquibase migration container (`gatelin-gatelin-migration-local`)
4. **Removes** the PostgreSQL data volume (`gatelin_postgres_data`)
5. **Restarts all services** by calling `./start-dev.sh` to rebuild and start fresh
6. **Restarts the Gatelin container** specifically to ensure clean reconnection to the database

### When to Use It

Use this script when you need to:
- Clear all database data and start fresh
- Reset the database after schema changes go wrong
- Fix migration conflicts or errors
- Clean up before running migrations from scratch

### How to Run

```bash
./reset-db.sh
```

**⚠️ WARNING**: This script **permanently deletes all database data**. Only use it in development environments, never in production!

### After Running

The script automatically:
1. Restarts all services using `start-dev.sh`
2. Rebuilds and starts the database container
3. Runs migrations automatically
4. Your application is ready to use with a fresh database and clean schema

---

## Running Tests

The Gatelin project uses Jest as the test runner with Babel for ES module support. Tests are located in the [tests/](tests/) directory.

### Available Test Commands

**Run all tests once:**
```bash
npm test
```

**Run tests in watch mode** (automatically re-runs on file changes):
```bash
npm run test:watch
```

**Run tests with coverage report:**
```bash
npm run test:coverage
```

### Test Structure

The test suite currently covers:
- Validators (ACL, route, consumer checks)
- Mappers (additional headers)
- HTTP middlewares (user retrieval, password checks)
- Cache middlewares (consumer caching)

All test files follow the pattern `*.test.js` and are organized by functionality in the [tests/middlewares/](tests/middlewares/) directory.

---


## Usage

### Docker

#### Building and Running with Docker Compose

To build and run the service (development):

```bash
docker-compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev up --build -d
```

To build and run the service (production):

```bash
docker-compose -f docker/docker-compose.prod.yml --env-file docker/conf/.env.prod up --build -d
```

To rebuild without cache:

```bash
docker-compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev build --no-cache && docker-compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev up
```


#### Building and Pushing to Docker Hub

```bash
# Get version from package.json
export VERSION=$(node -p "require('./package.json').version")

# Build using docker-compose with env file (uses VERSION variable)
docker-compose -f docker/docker-compose.prod.yml --env-file docker/conf/.env.prod build

# Login to Docker Hub
docker login

# Push version tag to Docker Hub
docker push dwtechs/gatelin:${VERSION}

# Optional: Also tag and push as 'latest' (see note below)
docker tag dwtechs/gatelin:${VERSION} dwtechs/gatelin:latest
docker push dwtechs/gatelin:latest
```

**Tagging strategy:**
- `:0.1.0` (or current version) - **Use this in production** for reproducible deployments
- `:latest` - Optional convenience tag for dev/testing (can be dangerous in production)

**Important:** Always use specific version tags (`:0.1.0`) in production environments, never `:latest`

#### Pulling from Docker Hub

```bash
# Pull latest version
docker pull dwtechs/gatelin:latest

# Pull specific version
docker pull dwtechs/gatelin:1.0.0

# Run the container
docker run -p 3000:3000 \
  -e DB_HOST=localhost \
  -e DB_NAME=gatelin \
  -e TOKEN_SECRET=your_secret \
  dwtechs/gatelin:latest
```