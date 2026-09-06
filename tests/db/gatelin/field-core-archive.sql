BEGIN;

DO $$
DECLARE
  core_id integer;
  custom_id integer;
  resource_id integer;
BEGIN
  SELECT id INTO STRICT resource_id FROM resource WHERE name = 'consumers';
  SELECT id INTO STRICT core_id FROM field WHERE "resourceId" = resource_id AND name = 'id' AND core;

  UPDATE fields
  SET name = 'db-test-core-field',
      "updaterId" = 9001,
      "updaterName" = 'db-test'
  WHERE id = core_id;

  IF NOT EXISTS (
    SELECT 1
    FROM field
    WHERE id = core_id
      AND name = 'db-test-core-field'
      AND core = true
      AND archived = false
  ) THEN
    RAISE EXCEPTION 'name update on a core field was rejected or mutated core/archived';
  END IF;

  BEGIN
    UPDATE fields
    SET archived = true,
        "updaterId" = 9002,
        "updaterName" = 'db-test-archive-core'
    WHERE id = core_id;
    RAISE EXCEPTION 'archiving a core field was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core field%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    UPDATE field
    SET core = false,
        "updaterId" = 9003,
        "updaterName" = 'db-test-unlock-core'
    WHERE id = core_id;
  END;

  IF EXISTS (
    SELECT 1
    FROM field
    WHERE id = core_id
      AND (archived = true OR core = false)
  ) THEN
    RAISE EXCEPTION 'core field archived or core flag cleared despite the guard';
  END IF;

  INSERT INTO fields (
    "resourceId",
    name,
    core,
    "creatorId",
    "creatorName"
  )
  VALUES (
    resource_id,
    'db-core-archive-custom',
    false,
    9004,
    'db-test'
  )
  RETURNING id INTO custom_id;

  UPDATE fields
  SET archived = true,
      "updaterId" = 9005,
      "updaterName" = 'db-test-custom-archive'
  WHERE id = custom_id;

  IF NOT EXISTS (
    SELECT 1
    FROM field
    WHERE id = custom_id
      AND core = false
      AND archived = true
      AND "archivedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'non-core field should still allow archive';
  END IF;
END;
$$;

ROLLBACK;
