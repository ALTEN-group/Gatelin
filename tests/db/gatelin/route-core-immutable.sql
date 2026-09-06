BEGIN;

DO $$
DECLARE
  resource_id integer;
  core_id integer;
  custom_id integer;
BEGIN
  SELECT id INTO STRICT resource_id FROM resource WHERE name = 'routes';
  SELECT id INTO STRICT core_id FROM route WHERE name = 'searchRoutes' AND core;

  UPDATE routes
  SET description = 'db-test core description',
      "updaterId" = 9001,
      "updaterName" = 'db-test'
  WHERE id = core_id;

  IF NOT EXISTS (
    SELECT 1
    FROM route
    WHERE id = core_id
      AND description = 'db-test core description'
      AND protected = true
      AND pattern = '/search'
      AND archived = false
  ) THEN
    RAISE EXCEPTION 'description update on a core route was rejected or mutated protected/pattern';
  END IF;

  BEGIN
    UPDATE routes
    SET protected = false,
        "updaterId" = 9002,
        "updaterName" = 'db-test-unprotect'
    WHERE id = core_id;
    RAISE EXCEPTION 'changing protected on a core route was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core route%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    UPDATE routes
    SET pattern = '/owned',
        "updaterId" = 9003,
        "updaterName" = 'db-test-repattern'
    WHERE id = core_id;
    RAISE EXCEPTION 'changing pattern on a core route was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core route%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    UPDATE routes
    SET archived = true,
        "updaterId" = 9004,
        "updaterName" = 'db-test-archive-core'
    WHERE id = core_id;
    RAISE EXCEPTION 'archiving a core route was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A core route%' THEN
        RAISE;
      END IF;
  END;

  IF EXISTS (
    SELECT 1
    FROM route
    WHERE id = core_id
      AND (
        protected = false
        OR pattern <> '/search'
        OR archived = true
      )
  ) THEN
    RAISE EXCEPTION 'core route protected, pattern, or archived changed despite the guard';
  END IF;

  INSERT INTO routes (
    "resourceId",
    pattern,
    name,
    protected,
    "creatorId",
    "creatorName"
  )
  VALUES (
    resource_id,
    '/db-core-immutable-custom',
    'dbCoreImmutableCustom',
    true,
    9005,
    'db-test'
  )
  RETURNING id INTO custom_id;

  UPDATE routes
  SET protected = false,
      "updaterId" = 9006,
      "updaterName" = 'db-test-custom-unprotect'
  WHERE id = custom_id;

  UPDATE routes
  SET archived = true,
      "updaterId" = 9007,
      "updaterName" = 'db-test-custom-archive'
  WHERE id = custom_id;

  IF NOT EXISTS (
    SELECT 1
    FROM route
    WHERE id = custom_id
      AND core = false
      AND protected = false
      AND archived = true
      AND "archivedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'non-core route should still allow protected and archive updates';
  END IF;
END;
$$;

ROLLBACK;
