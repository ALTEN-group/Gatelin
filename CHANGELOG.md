
# Unreleased

  - Fixed the trusted-device check pointing at `/foxnox/trusted-devices/verify`, which Foxnox serves as `/foxnox/devices/verify`. The 404 was swallowed as a warning, so every login was treated as coming from an unknown device and re-prompted for 2FA.
  - `scripts/setup-mocks.sh` now sends a consumer identity when generating mock passwords, and stamps an updater on the challenge-persona rows, as Foxnox requires audit identity on tracked writes

# 0.1.0-alpha.9 (Aug 29th 2026)

  - Switched the password mock flow to the Foxnox integration and aligned the runtime configuration with environment-based settings

# 0.1.0-alpha.8 (Aug 27th 2026)

  - Added PostgreSQL contract tests for the database schema and service behavior
  - Updated Angular and related frontend dependencies
  - Configured password endpoints through environment variables

# 0.1.0 (Aug 12th 2026)

  - Initial release
