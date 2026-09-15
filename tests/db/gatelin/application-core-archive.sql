BEGIN;

DO $$
DECLARE
  core_id integer;
  custom_id integer;
BEGIN
  SELECT id INTO STRICT core_id FROM application WHERE name = 'Gatelin' AND core;

  UPDATE application
  SET description = 'db-test core description',
      "updaterId" = 9001,
      "updaterName" = 'db-test'
  WHERE id = core_id;

  IF NOT EXISTS (
    SELECT 1
    FROM application
    WHERE id = core_id
      AND description = 'db-test core description'
      AND core = true
      AND archived = false
  ) THEN
    RAISE EXCEPTION 'description update on a core application was rejected or mutated core/archived';
  END IF;

  BEGIN
    UPDATE application
    SET archived = true,
        "updaterId" = 9002,
        "updaterName" = 'db-test-archive-core'
    WHERE id = core_id;
    RAISE EXCEPTION 'archiving a core application was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core application%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    UPDATE application
    SET core = false,
        "updaterId" = 9003,
        "updaterName" = 'db-test-unlock-core'
    WHERE id = core_id;
  END;

  IF EXISTS (
    SELECT 1
    FROM application
    WHERE id = core_id
      AND (archived = true OR core = false)
  ) THEN
    RAISE EXCEPTION 'core application archived or core flag cleared despite the guard';
  END IF;

  INSERT INTO application (
    name,
    description,
    core,
    "creatorId",
    "creatorName"
  )
  VALUES (
    'db-core-archive-custom',
    'unlocked application used to prove archive still works',
    false,
    9004,
    'db-test'
  )
  RETURNING id INTO custom_id;

  UPDATE application
  SET archived = true,
      "updaterId" = 9005,
      "updaterName" = 'db-test-custom-archive'
  WHERE id = custom_id;

  IF NOT EXISTS (
    SELECT 1
    FROM application
    WHERE id = custom_id
      AND core = false
      AND archived = true
      AND "archivedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'non-core application should still allow archive';
  END IF;
END;
$$;

ROLLBACK;
