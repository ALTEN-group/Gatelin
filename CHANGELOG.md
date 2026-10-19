# 0.1.0-alpha.11 (Oct 19th 2026)

  - Fixed `POST /sessions` rejecting valid passwords shorter than 9 or longer than 20 characters: login now only bounds `pwd` to 1-255 characters and leaves the password policy to the password service

# 0.1.0-alpha.10 (Sep 14th 2026)

  - Added history logging functions, triggers, and indexes for audit trail tracking across resources
  - Refactored archived-records and old-history deletion to execute as asynchronous background jobs via a dedicated job pool
  - Added PostgreSQL contract test suite validating resource archiving, immutability, and job permissions
  - Integrated k6 performance testing framework with interactive HTML reporting, thresholds, and benchmark tracking
  - Integrated RESTler API fuzzing with multi-architecture Apple Silicon support, token refresh, and test lifecycle alignment
  - Added configurable rate limiting bypass (`SESSION_RATE_LIMIT_MAX=0` or `disabled`) for load testing
  - Fixed trusted-device check pointing at `/foxnox/devices/verify` instead of `/foxnox/trusted-devices/verify`
  - Updated `scripts/setup-mocks.sh` to provide consumer audit identity on mock seed writes
  - Added per-service `forwardedCookies` so the proxy forwards only registered cookies on HTTP and WebSocket requests (Gatelin session cookies are never forwarded)

# 0.1.0-alpha.9 (Aug 29th 2026)

  - Switched the password mock flow to the Foxnox integration and aligned the runtime configuration with environment-based settings

# 0.1.0-alpha.8 (Aug 27th 2026)

  - Added PostgreSQL contract tests for the database schema and service behavior
  - Updated Angular and related frontend dependencies
  - Configured password endpoints through environment variables

# 0.1.0 (Aug 12th 2026)

  - Initial release
