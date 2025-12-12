# Gatelin

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