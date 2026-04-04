# Security

## Built-in Protections

- All routes can require JWT authentication via the `jwt` flag
- Tokens are validated on every request to protected routes
- Consumer sessions are cached and validated against the database
- Security headers are automatically applied via Helmet.js
- Role-based access control (RBAC) is enforced via ACL validation

## Production Recommendations

1. **Secrets management** — Store sensitive data in Docker secrets or external vaults
2. **Restrict Traefik dashboard** — Add authentication or remove port `8080` exposure
3. **HTTPS only** — Ensure HTTP redirects to HTTPS
4. **Regular updates** — Keep Docker images and dependencies up to date
5. **Network isolation** — Use internal networks for service-to-service communication
6. **Database security** — Use strong passwords and restrict network access
7. **Rate limiting** — Configure rate limits in Traefik middleware
8. **Audit logs** — Enable comprehensive logging and monitoring

## Log Rotation

Configure Docker log rotation in `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## Automated Database Backups

```bash
#!/bin/bash
docker exec gatelin-postgres pg_dump -U gatelin_user gatelin | \
  gzip > /backups/gatelin_$(date +%Y%m%d_%H%M%S).sql.gz
```

Add to crontab for daily backups at 2 AM:

```
0 2 * * * /path/to/backup-script.sh
```
