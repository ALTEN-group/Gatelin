BEGIN;

DO $$
DECLARE
  core_id integer;
  custom_id integer;
  field_id integer;
BEGIN
  SELECT "fieldId" INTO STRICT field_id FROM condition WHERE name = 'Non-archived only' AND core;
  SELECT id INTO STRICT core_id FROM condition WHERE name = 'Non-archived only' AND core;

  UPDATE conditions
  SET value = 'db-test-core-value',
      "updaterId" = 9001,
      "updaterName" = 'db-test'
  WHERE id = core_id;

  IF NOT EXISTS (
    SELECT 1
    FROM condition
    WHERE id = core_id
      AND value = 'db-test-core-value'
      AND core = true
      AND archived = false
  ) THEN
    RAISE EXCEPTION 'value update on a core condition was rejected or mutated core/archived';
  END IF;

  BEGIN
    UPDATE conditions
    SET archived = true,
        "updaterId" = 9002,
        "updaterName" = 'db-test-archive-core'
    WHERE id = core_id;
    RAISE EXCEPTION 'archiving a core condition was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core condition%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    UPDATE condition
    SET core = false,
        "updaterId" = 9003,
        "updaterName" = 'db-test-unlock-core'
    WHERE id = core_id;
  END;

  IF EXISTS (
    SELECT 1
    FROM condition
    WHERE id = core_id
      AND (archived = true OR core = false)
  ) THEN
    RAISE EXCEPTION 'core condition archived or core flag cleared despite the guard';
  END IF;

  INSERT INTO conditions (
    name,
    "fieldId",
    op,
    value,
    core,
    "creatorId",
    "creatorName"
  )
  VALUES (
    'db-core-archive-custom',
    field_id,
    '=',
    'false',
    false,
    9004,
    'db-test'
  )
  RETURNING id INTO custom_id;

  UPDATE conditions
  SET archived = true,
      "updaterId" = 9005,
      "updaterName" = 'db-test-custom-archive'
  WHERE id = custom_id;

  IF NOT EXISTS (
    SELECT 1
    FROM condition
    WHERE id = custom_id
      AND core = false
      AND archived = true
      AND "archivedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'non-core condition should still allow archive';
  END IF;
END;
$$;

ROLLBACK;
