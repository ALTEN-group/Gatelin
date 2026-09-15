BEGIN;

DO $$
DECLARE
  core_id integer;
  custom_id integer;
  route_id integer;
BEGIN
  SELECT "routeId" INTO STRICT route_id FROM scope WHERE name = 'session' AND core;
  SELECT id INTO STRICT core_id FROM scope WHERE name = 'session' AND core;

  UPDATE scopes
  SET name = 'db-test-core-scope',
      "updaterId" = 9001,
      "updaterName" = 'db-test'
  WHERE id = core_id;

  IF NOT EXISTS (
    SELECT 1
    FROM scope
    WHERE id = core_id
      AND name = 'db-test-core-scope'
      AND core = true
      AND archived = false
  ) THEN
    RAISE EXCEPTION 'name update on a core scope was rejected or mutated core/archived';
  END IF;

  BEGIN
    UPDATE scopes
    SET archived = true,
        "updaterId" = 9002,
        "updaterName" = 'db-test-archive-core'
    WHERE id = core_id;
    RAISE EXCEPTION 'archiving a core scope was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core scope%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    UPDATE scope
    SET core = false,
        "updaterId" = 9003,
        "updaterName" = 'db-test-unlock-core'
    WHERE id = core_id;
  END;

  IF EXISTS (
    SELECT 1
    FROM scope
    WHERE id = core_id
      AND (archived = true OR core = false)
  ) THEN
    RAISE EXCEPTION 'core scope archived or core flag cleared despite the guard';
  END IF;

  INSERT INTO scopes (
    "routeId",
    name,
    core,
    "creatorId",
    "creatorName"
  )
  VALUES (
    route_id,
    'db-core-archive-custom',
    false,
    9004,
    'db-test'
  )
  RETURNING id INTO custom_id;

  UPDATE scopes
  SET archived = true,
      "updaterId" = 9005,
      "updaterName" = 'db-test-custom-archive'
  WHERE id = custom_id;

  IF NOT EXISTS (
    SELECT 1
    FROM scope
    WHERE id = custom_id
      AND core = false
      AND archived = true
      AND "archivedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'non-core scope should still allow archive';
  END IF;
END;
$$;

ROLLBACK;
