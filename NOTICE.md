# Gatelin

## Usage

### Docker

#### Building and Running with Docker Compose

To build and run the service (development):

```bash
cd docker
docker-compose --env-file conf/.env.dev up --build
```

To build and run the service (production):

```bash
cd docker
docker-compose --env-file conf/.env.prod -f docker-compose.prod.yml up --build
```

To run in detached mode (background):

```bash
cd docker
docker-compose --env-file conf/.env.dev up --build -d
```

To rebuild without cache:

```bash
cd docker
docker-compose --env-file conf/.env.dev build --no-cache
docker-compose --env-file conf/.env.dev up
```