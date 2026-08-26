BEGIN;

DO $$
DECLARE
  routes_resource integer;
  cors_resource integer;
  template_default integer;
  template_compact integer;
  fork_id integer;
  i integer;
BEGIN
  SELECT id INTO STRICT routes_resource FROM resource WHERE name = 'routes';
  SELECT id INTO STRICT cors_resource FROM resource WHERE name = 'cors';
  SELECT id INTO STRICT template_default
  FROM preference
  WHERE "resourceId" = routes_resource
    AND "userId" IS NULL
    AND name = 'Default';
  SELECT id INTO STRICT template_compact
  FROM preference
  WHERE "resourceId" = routes_resource
    AND "userId" IS NULL
    AND name = 'Compact';

  UPDATE preferences
  SET
    name = 'Forked',
    conf = '[{"key":"id","isVisible":true}]'::jsonb,
    "updaterId" = 9001,
    "updaterName" = 'db-test-fork'
  WHERE id = template_default;

  SELECT id INTO STRICT fork_id
  FROM preference
  WHERE "userId" = 9001
    AND "resourceId" = routes_resource
    AND name = 'Forked (copy)';

  IF EXISTS (
    SELECT 1
    FROM preference
    WHERE id = template_default
      AND name <> 'Default'
  ) THEN
    RAISE EXCEPTION 'template row was mutated instead of forked';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM preference_selection
    WHERE "userId" = 9001
      AND "resourceId" = routes_resource
      AND "preferenceId" = fork_id
  ) THEN
    RAISE EXCEPTION 'forked preference was not selected for the acting user';
  END IF;

  UPDATE preferences
  SET
    "isActive" = true,
    "updaterId" = 9001,
    "updaterName" = 'db-test-select'
  WHERE id = template_compact;

  IF (SELECT count(*) FROM preference WHERE "userId" = 9001 AND "resourceId" = routes_resource) <> 1 THEN
    RAISE EXCEPTION 'selecting a template created an extra preference row';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM preference_selection
    WHERE "userId" = 9001
      AND "resourceId" = routes_resource
      AND "preferenceId" = template_compact
  ) THEN
    RAISE EXCEPTION 'selecting a template did not point preference_selection at the template';
  END IF;

  BEGIN
    DELETE FROM preferences WHERE id = template_default;
    RAISE EXCEPTION 'template preference delete was allowed';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A template preference%' THEN
        RAISE;
      END IF;
  END;

  BEGIN
    INSERT INTO preferences (
      "userId",
      "resourceId",
      name,
      conf,
      "creatorId",
      "creatorName"
    )
    VALUES (
      9001,
      routes_resource,
      'Default',
      '[{"key":"id"}]'::jsonb,
      9001,
      'db-test'
    );
    RAISE EXCEPTION 'personal preference reused a template name';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'A preference cannot use the same name%' THEN
        RAISE;
      END IF;
  END;

  FOR i IN 1..10 LOOP
    INSERT INTO preferences (
      "userId",
      "resourceId",
      name,
      conf,
      "creatorId",
      "creatorName"
    )
    VALUES (
      9100,
      cors_resource,
      'db-pref-' || i,
      '[{"key":"id"}]'::jsonb,
      9100,
      'db-test-limit'
    );
  END LOOP;

  BEGIN
    INSERT INTO preferences (
      "userId",
      "resourceId",
      name,
      conf,
      "creatorId",
      "creatorName"
    )
    VALUES (
      9100,
      cors_resource,
      'db-pref-11',
      '[{"key":"id"}]'::jsonb,
      9100,
      'db-test-limit'
    );
    RAISE EXCEPTION 'preference limit of 10 was not enforced';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM NOT LIKE 'Preference limit reached%' THEN
        RAISE;
      END IF;
  END;
END;
$$;

ROLLBACK;
