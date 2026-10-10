
# Unreleased

  - **Audit log page:** new `Audit log` menu entry listing every tracked change across Gatelin tables (who, what, when, old → new values), newest first, filterable by date, user, entity, action and record id. Backed by the read-only `POST /gatelin/audit/search` route over the new `log.audit` view (previous snapshot, changed columns, `ARCHIVE`/`RESTORE` actions). Hashes and secrets are never returned (`[redacted]`). The route `searchAudit` (id `82`, resource `audit`) is seeded for Super admin and Admin only, see `app.acls.ts`; existing databases must be recreated since the seeds changed

  - Admin: every grid now sorts by `id` ascending by default instead of relying on database row order. Clicking a column header still overrides it
  - `PUT /preferences/:resource` now accepts system templates (as well as the caller's own rows) instead of answering `403`: selecting a template records the caller's choice and editing one (e.g. resizing a column) forks a personal copy. Another user's rows or another resource's ids are still rejected with `403`
  - Fixed `PUT`/`POST /preferences/:resource` failing with `Invalid "conf" ... Expected object, but received string`: `conf` is stringified before validation, so it is now typed `json`
  - Updated `@dwtechs/antity-pgsql` to `0.25.0`
  - Mark audit dates (`archivedAt`, `createdAt`, `updatedAt`) as `readOnly` so a full-row PUT from the admin no longer sends them to validation

# 0.1.0-alpha.10 (Sep 14th 2026)

  - Added history logging functions, triggers, and indexes for audit trail tracking across resources
  - Refactored archived-records and old-history deletion to execute as asynchronous background jobs via a dedicated job pool
  - Added PostgreSQL contract test suite validating resource archiving, immutability, and job permissions
  - Integrated k6 performance testing framework with interactive HTML reporting, thresholds, and benchmark tracking
  - Integrated RESTler API fuzzing with multi-architecture Apple Silicon support, token refresh, and test lifecycle alignment
  - Added configurable rate limiting bypass (`SESSION_RATE_LIMIT_MAX=0` or `disabled`) for load testing
  - Fixed trusted-device check pointing at `/foxnox/devices/verify` instead of `/foxnox/trusted-devices/verify`
  - Updated `scripts/setup-mocks.sh` to provide consumer audit identity on mock seed writes

# 0.1.0-alpha.9 (Aug 29th 2026)

  - Switched the password mock flow to the Foxnox integration and aligned the runtime configuration with environment-based settings

# 0.1.0-alpha.8 (Aug 27th 2026)

  - Added PostgreSQL contract tests for the database schema and service behavior
  - Updated Angular and related frontend dependencies
  - Configured password endpoints through environment variables

# 0.1.0 (Aug 12th 2026)

  - Initial release
