BEGIN;

DO $$
DECLARE
  rid integer;
BEGIN
  SELECT id INTO STRICT rid FROM route WHERE name = 'deletePermissions' AND core;

  IF EXISTS (
    SELECT 1
    FROM route
    WHERE id = rid
      AND pattern = '/archive'
  ) THEN
    RAISE EXCEPTION 'deletePermissions must not use the archive pattern';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM routes
    WHERE id = rid
      AND pattern = ''
      AND "methodIds" = ARRAY[5]
      AND "operationId" @> ARRAY[11]
      AND NOT ("operationId" @> ARRAY[9])
  ) THEN
    RAISE EXCEPTION 'deletePermissions must be DELETE on the collection with bulk delete';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM route r
    JOIN resource res ON res.id = r."resourceId"
    WHERE res.name = 'permissions'
      AND r.pattern = '/archive'
  ) THEN
    RAISE EXCEPTION 'permissions must not expose an /archive route';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM permission
    WHERE "routeId" = rid
      AND "operationId" = 9
  ) THEN
    RAISE EXCEPTION 'deletePermissions grants must not still use bulk archive';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM permission
    WHERE "roleId" = 1
      AND "routeId" = rid
      AND "operationId" = 11
  ) THEN
    RAISE EXCEPTION 'Super-admin must hold bulk delete on deletePermissions';
  END IF;
END;
$$;

ROLLBACK;
