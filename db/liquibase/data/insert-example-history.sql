-- Example history data: UPDATE statements on views to exercise the full trigger chain.
-- Each UPDATE goes through the INSTEAD OF trigger → underlying table write → change_trigger → log.history.
-- updaterId=-1 / updaterName='system' is passed via the virtual columns on each view.

-- service id=1: pattern corrected, locked set to true
UPDATE "service" SET
  pattern = 'gatay',
  locked = true,
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;
UPDATE "service" SET
  pattern = 'gateway',
  locked = true,
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;


-- resource id=1 (session): locked set to true
UPDATE resources SET
  locked = false,
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;
UPDATE resources SET
  locked = true,
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;

-- operation id=1 (read): description refined
UPDATE operation SET
  description = 'Retrieve a resource',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;
UPDATE operation SET
  description = 'Retrieve a single resource',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;


-- cors id=1: port suffix removed from origin
UPDATE cors SET
  name = 'capacito://localhost',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;
UPDATE cors SET
  name = 'capacitor://localhost',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;

-- route id=1 (refreshToken): description expanded
UPDATE routes SET
  description = 'Refresh a token a refresh token',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;
UPDATE routes SET
  description = 'Refresh a token or Sign in with a refresh token',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;

-- field id=1 (consumers.id): locked set to true
UPDATE fields SET
  locked = true,
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;
UPDATE fields SET
  locked = false,
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;

-- scope id=1 (session): routeId updated to 50
UPDATE scopes SET
  "routeId" = 50,
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;
-- scope id=1 (session): routeId updated to 49
UPDATE scopes SET
  "routeId" = 49,
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;


ANALYZE;
