# Gatelin

## Usage

### Docker

#### Building and Running with Docker Compose

To build and run the service (development):

```bash
docker-compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev up --build
```

To build and run the service (production):

```bash
docker-compose -f docker/docker-compose.prod.yml --env-file docker/conf/.env.prod up --build
```

To run in detached mode (background):

```bash
docker-compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev up --build -d
```

To rebuild without cache:

```bash
docker-compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev build --no-cache && docker-compose -f docker/docker-compose.yml --env-file docker/conf/.env.dev up
```