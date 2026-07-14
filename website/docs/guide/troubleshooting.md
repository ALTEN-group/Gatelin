# Troubleshooting

## Container Won't Start

```bash
docker-compose logs <service-name>
```

## Database Connection Issues

```bash
# Check if PostgreSQL is running
docker exec my-project-postgres-local pg_isready -U root -d gatelin

# Test connection from gateway container
docker exec my-project-gatelin-local nc -zv my-project-postgres-local 5432
```

## Migration Failures

```bash
# View migration logs
docker logs my-project-gatelin-migration-local

# Rollback the last changeset
docker compose run --rm -e UPDATE=0 -e ROLLBACK=1 gatelin_migration
```
