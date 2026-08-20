# Troubleshooting

## Container Won't Start

```bash
docker-compose logs <service-name>
```

Boot also refuses to start when a required env var is missing — check [Environment Variables](./configuration) and the Gatelin logs for the first failing name.

## Database Connection Issues

```bash
# Check if PostgreSQL is running
docker exec my-project-postgres-local pg_isready -U root -d gatelin

# Test connection from the Gatelin container
docker exec my-project-gatelin-local nc -zv my-project-postgres-local 5432
```

## Migration Failures

```bash
# View migration logs
docker logs my-project-gatelin-migration-local

# Rollback the last changeset
docker compose run --rm -e UPDATE=0 -e ROLLBACK=1 gatelin_migration
```

## Login Returns 202 Forever / Challenge Never Completes

`POST /gatelin/sessions` answering **202** means the password was accepted but a mid-login challenge is required. Confirm:

1. The browser is redirected to the `url` from the 202 body (not left on the login form).
2. The password service is reachable at the base derived from `PWD_CHECK_URL` — Gatelin also calls `{base}/pwd/challenges`, `{base}/pwd/trusted-devices/verify`, and `{base}/pwd/login-tickets/redeem`.
3. After the challenge pages finish, the browser lands on the admin login with `?ticket=…` and the client calls `POST /gatelin/sessions/resume`.
4. Tickets are one-shot and short-lived — refreshing the resume URL a second time will fail with **400**.

See [Sessions](./api-sessions#login) and [Frontend Integration](./frontend#resume-after-a-challenge).

## Login Always Succeeds Without 2FA

Mid-login challenges only run when `PWD_CHECK_URL` returns a user row with `twoFactorEnabled`, `pwdExpiry`, or `lockedUntil`. A compare endpoint that answers without a row (e.g. `{ success: true }`) intentionally skips gating and logs a note — that is the expected behaviour for a password-only service. To enable challenges, return the row documented in the [Sessions contract](./api-sessions#password-service-contract).

## 401 After a Successful Login

A valid access token is rejected when `checkConsumer` does not find it in **this** process’s session cache. That happens if more than one Gatelin instance is load-balanced: login wrote the session on replica A and the next request hit replica B. Run a single replica — Traefik sticky sessions do not fix it. See [Deployment](./deployment#scaling).

## Account Locked (403)

Returned when the pwd row's `lockedUntil` is still in the future. Unlock / clear the lock on the password service, then retry login.
