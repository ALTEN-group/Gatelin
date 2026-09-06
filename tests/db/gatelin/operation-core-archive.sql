BEGIN;

DO $$
DECLARE
  core_id integer;
  custom_id integer;
BEGIN
  SELECT id INTO STRICT core_id FROM operation WHERE name = 'read' AND core;

  UPDATE operation
  SET description = 'db-test core description',
      "updaterId" = 9001,
      "updaterName" = 'db-test'
  WHERE id = core_id;

  IF NOT EXISTS (
    SELECT 1
    FROM operation
    WHERE id = core_id
      AND description = 'db-test core description'
      AND core = true
      AND archived = false
  ) THEN
    RAISE EXCEPTION 'description update on a core operation was rejected or mutated core/archived';
  END IF;

  BEGIN
    UPDATE operation
    SET archived = true,
        "updaterId" = 9002,
        "updaterName" = 'db-test-archive-core'
    WHERE id = core_id;
    RAISE EXCEPTION 'archiving a core operation was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core operation%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    UPDATE operation
    SET core = false,
        "updaterId" = 9003,
        "updaterName" = 'db-test-unlock-core'
    WHERE id = core_id;
  END;

  IF EXISTS (
    SELECT 1
    FROM operation
    WHERE id = core_id
      AND (archived = true OR core = false)
  ) THEN
    RAISE EXCEPTION 'core operation archived or core flag cleared despite the guard';
  END IF;

  INSERT INTO operation (
    name,
    description,
    core,
    "creatorId",
    "creatorName"
  )
  VALUES (
    'db-core-archive-custom',
    'non-core operation used to prove archive still works',
    false,
    9004,
    'db-test'
  )
  RETURNING id INTO custom_id;

  UPDATE operation
  SET archived = true,
      "updaterId" = 9005,
      "updaterName" = 'db-test-custom-archive'
  WHERE id = custom_id;

  IF NOT EXISTS (
    SELECT 1
    FROM operation
    WHERE id = custom_id
      AND core = false
      AND archived = true
      AND "archivedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'non-core operation should still allow archive';
  END IF;
END;
$$;

ROLLBACK;
