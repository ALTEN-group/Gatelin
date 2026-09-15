BEGIN;

DO $$
DECLARE
  core_id integer;
  custom_id integer;
BEGIN
  SELECT id INTO STRICT core_id FROM service WHERE name = 'gatelin' AND core;

  UPDATE service
  SET pattern = 'db-test-core-pattern',
      "updaterId" = 9001,
      "updaterName" = 'db-test'
  WHERE id = core_id;

  IF NOT EXISTS (
    SELECT 1
    FROM service
    WHERE id = core_id
      AND pattern = 'db-test-core-pattern'
      AND core = true
      AND archived = false
  ) THEN
    RAISE EXCEPTION 'pattern update on a core service was rejected or mutated core/archived';
  END IF;

  BEGIN
    UPDATE service
    SET archived = true,
        "updaterId" = 9002,
        "updaterName" = 'db-test-archive-core'
    WHERE id = core_id;
    RAISE EXCEPTION 'archiving a core service was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core service%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    UPDATE service
    SET core = false,
        "updaterId" = 9003,
        "updaterName" = 'db-test-unlock-core'
    WHERE id = core_id;
  END;

  IF EXISTS (
    SELECT 1
    FROM service
    WHERE id = core_id
      AND (archived = true OR core = false)
  ) THEN
    RAISE EXCEPTION 'core service archived or core flag cleared despite the guard';
  END IF;

  INSERT INTO service (
    name,
    pattern,
    core,
    "creatorId",
    "creatorName"
  )
  VALUES (
    'db-svc-custom',
    'db-custom',
    false,
    9004,
    'db-test'
  )
  RETURNING id INTO custom_id;

  UPDATE service
  SET archived = true,
      "updaterId" = 9005,
      "updaterName" = 'db-test-custom-archive'
  WHERE id = custom_id;

  IF NOT EXISTS (
    SELECT 1
    FROM service
    WHERE id = custom_id
      AND core = false
      AND archived = true
      AND "archivedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'non-core service should still allow archive';
  END IF;
END;
$$;

ROLLBACK;
