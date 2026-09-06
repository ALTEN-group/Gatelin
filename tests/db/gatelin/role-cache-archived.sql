BEGIN;

DO $$
DECLARE
  app_id integer;
  route_id integer;
  custom_id integer;
BEGIN
  SELECT id INTO STRICT app_id FROM application WHERE name = 'Gatelin';
  SELECT id INTO STRICT route_id FROM route WHERE name = 'searchRoles';

  INSERT INTO roles (
    "appId",
    name,
    description,
    "creatorId",
    "creatorName"
  )
  VALUES (
    app_id,
    'db-role-cache-archived',
    'unlocked role used to prove archived rows leave role_cache',
    9001,
    'db-test'
  )
  RETURNING id INTO custom_id;

  INSERT INTO permission (
    "roleId",
    "routeId",
    "operationId",
    active,
    "creatorId",
    "creatorName"
  )
  VALUES (
    custom_id,
    route_id,
    2,
    true,
    9001,
    'db-test'
  );

  IF NOT EXISTS (
    SELECT 1
    FROM role_cache
    WHERE id = custom_id
      AND jsonb_array_length(permissions) > 0
  ) THEN
    RAISE EXCEPTION 'live custom role with an active permission must appear in role_cache';
  END IF;

  UPDATE roles
  SET archived = true,
      "updaterId" = 9002,
      "updaterName" = 'db-test-archive'
  WHERE id = custom_id;

  IF NOT EXISTS (
    SELECT 1
    FROM role
    WHERE id = custom_id
      AND archived = true
  ) THEN
    RAISE EXCEPTION 'role row must remain after archive';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM permission
    WHERE "roleId" = custom_id
      AND active = true
  ) THEN
    RAISE EXCEPTION 'active permission rows must remain on an archived role';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM role_cache
    WHERE id = custom_id
  ) THEN
    RAISE EXCEPTION 'archived role must not appear in role_cache';
  END IF;
END;
$$;

ROLLBACK;
