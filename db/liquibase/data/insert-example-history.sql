-- Example history data: UPDATE statements on views to exercise the full trigger chain.
-- Each UPDATE goes through the INSTEAD OF trigger → underlying table write → change_trigger → log.history.
-- consumerId=-1 / consumerName='system' is passed via the virtual columns on each view.

-- service id=1: pattern corrected, locked set to true
UPDATE services SET
  pattern = 'gatay',
  locked = true,
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;
UPDATE services SET
  pattern = 'gateway',
  locked = true,
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;


-- resource id=1 (session): locked set to true
UPDATE resources SET
  locked = false,
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;
UPDATE resources SET
  locked = true,
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;

-- operation id=1 (read): description refined
UPDATE operations SET
  description = 'Retrieve a resource',
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;
UPDATE operations SET
  description = 'Retrieve a single resource',
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;


-- cors id=1: port suffix removed from origin
UPDATE cors_list SET
  name = 'capacito://localhost',
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;
UPDATE cors_list SET
  name = 'capacitor://localhost',
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;

-- route id=1 (refreshToken): description expanded
UPDATE routes SET
  description = 'Refresh a token a refresh token',
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;
UPDATE routes SET
  description = 'Refresh a token or Sign in with a refresh token',
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;

-- field id=1 (consumers.id): locked set to true
UPDATE fields SET
  locked = true,
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;
UPDATE fields SET
  locked = false,
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;

-- scope id=1 (session): routeId updated to 50
UPDATE scopes SET
  "routeId" = 50,
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;
-- scope id=1 (session): routeId updated to 50
UPDATE scopes SET
  "routeId" = 49,
  "consumerId" = -1,
  "consumerName" = 'system'
WHERE id = 1;


ANALYZE;
