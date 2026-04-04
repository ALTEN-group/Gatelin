# Troubleshooting

## Container Won't Start

```bash
docker-compose logs <service-name>
```

## Database Connection Issues

```bash
# Check if PostgreSQL is running
docker exec gatelin-postgres pg_isready -U gatelin_user

# Test connection from gateway container
docker exec gatelin-api nc -zv postgres 5432
```

## Migration Failures

```bash
# View migration logs
docker logs gatelin-migration

# Rollback migration
docker-compose run --rm gatelin_migration \
  -e ROLLBACK=true -e UPDATE=false
```
