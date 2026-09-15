BEGIN;

DO $$
DECLARE
  app_id integer;
  locked_id integer;
  custom_id integer;
BEGIN
  SELECT id INTO STRICT app_id FROM application WHERE name = 'Gatelin';
  SELECT id INTO STRICT locked_id FROM role WHERE name = 'Gatelin super admin' AND locked;

  INSERT INTO roles (
    "appId",
    name,
    description,
    "creatorId",
    "creatorName"
  )
  VALUES (
    app_id,
    'db-locked-archive-custom',
    'unlocked role used to prove archive still works',
    9001,
    'db-test'
  )
  RETURNING id INTO custom_id;

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
      AND "archivedAt" IS NOT NULL
      AND locked = false
  ) THEN
    RAISE EXCEPTION 'archiving an unlocked role through the roles view did not set archived and archivedAt';
  END IF;

  BEGIN
    UPDATE roles
    SET archived = true,
        "updaterId" = 9003,
        "updaterName" = 'db-test-locked-archive'
    WHERE id = locked_id;
    RAISE EXCEPTION 'archiving a locked system role through the roles view was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A locked system role%' THEN
        RAISE;
      END IF;
  END;

  IF EXISTS (
    SELECT 1
    FROM role
    WHERE id = locked_id
      AND archived = true
  ) THEN
    RAISE EXCEPTION 'locked system role was archived despite the guard';
  END IF;
END;
$$;

ROLLBACK;
