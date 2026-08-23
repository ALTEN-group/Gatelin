
# Unreleased

  - `PUT /sessions` (refresh) no longer requires a decodable access token: the consumer is now resolved from the refresh token alone (cookie or body), via a new `consumer` cache index and `checkConsumerByRefreshToken` middleware. Enables refreshing a session across apps that share the same origin/cookie without a locally stored access token.
  - Bumped `@dwtechs/toker-express` to `0.9.0` (adds `decodedRefresh.iss` support in `refreshTokens()`)
  - Breaking: rename Gatelin's control-plane and session API prefix from `/gateway` to `/gatelin`
  - Rename the production build target and Liquibase schema directory from `gateway` to `gatelin`

# 0.1.0 (Aug 12th 2026)

  - Initial release
