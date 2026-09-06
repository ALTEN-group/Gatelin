BEGIN;

DO $$
DECLARE
  core_id integer;
  custom_id integer;
  service_id integer;
BEGIN
  SELECT id INTO STRICT service_id FROM service WHERE name = 'gatelin';
  SELECT id INTO STRICT core_id FROM resource WHERE name = 'routes' AND core;

  UPDATE resources
  SET description = 'db-test core description',
      "updaterId" = 9001,
      "updaterName" = 'db-test'
  WHERE id = core_id;

  IF NOT EXISTS (
    SELECT 1
    FROM resource
    WHERE id = core_id
      AND description = 'db-test core description'
      AND core = true
      AND archived = false
  ) THEN
    RAISE EXCEPTION 'description update on a core resource was rejected or mutated core/archived';
  END IF;

  BEGIN
    UPDATE resources
    SET archived = true,
        "updaterId" = 9002,
        "updaterName" = 'db-test-archive-core'
    WHERE id = core_id;
    RAISE EXCEPTION 'archiving a core resource was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core resource%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    UPDATE resources
    SET core = false,
        "updaterId" = 9003,
        "updaterName" = 'db-test-unlock-core'
    WHERE id = core_id;
  END;

  IF EXISTS (
    SELECT 1
    FROM resource
    WHERE id = core_id
      AND (archived = true OR core = false)
  ) THEN
    RAISE EXCEPTION 'core resource archived or core flag cleared despite the guard';
  END IF;

  INSERT INTO resources (
    "serviceId",
    name,
    description,
    "creatorId",
    "creatorName"
  )
  VALUES (
    service_id,
    'db-core-archive-custom',
    'non-core resource used to prove archive still works',
    9004,
    'db-test'
  )
  RETURNING id INTO custom_id;

  UPDATE resources
  SET archived = true,
      "updaterId" = 9005,
      "updaterName" = 'db-test-custom-archive'
  WHERE id = custom_id;

  IF NOT EXISTS (
    SELECT 1
    FROM resource
    WHERE id = custom_id
      AND core = false
      AND archived = true
      AND "archivedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'non-core resource should still allow archive';
  END IF;
END;
$$;

ROLLBACK;
