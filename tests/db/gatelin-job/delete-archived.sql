BEGIN;

DO $$
DECLARE
  resource_id integer;
  old_id integer;
  new_id integer;
  deleted_count integer;
BEGIN
  SELECT id INTO STRICT resource_id FROM resource WHERE name = 'routes';

  INSERT INTO route (
    "resourceId",
    pattern,
    name,
    protected,
    archived,
    "archivedAt",
    "creatorId",
    "creatorName"
  )
  VALUES (
    resource_id,
    '/db-job-archive-old',
    'dbJobArchiveOldRoute',
    true,
    true,
    NOW() - INTERVAL '3 months',
    9001,
    'db-job-test'
  )
  RETURNING id INTO old_id;

  INSERT INTO route (
    "resourceId",
    pattern,
    name,
    protected,
    archived,
    "archivedAt",
    "creatorId",
    "creatorName"
  )
  VALUES (
    resource_id,
    '/db-job-archive-new',
    'dbJobArchiveNewRoute',
    true,
    true,
    NOW() - INTERVAL '1 day',
    9001,
    'db-job-test'
  )
  RETURNING id INTO new_id;

  SELECT delete(
    'public'::text,
    'route'::text,
    (NOW() - INTERVAL '2 months')::timestamp
  ) INTO deleted_count;

  IF deleted_count <> 1 THEN
    RAISE EXCEPTION 'delete() should hard-delete 1 old archived route, got %', deleted_count;
  END IF;

  IF EXISTS (SELECT 1 FROM route WHERE id = old_id) THEN
    RAISE EXCEPTION 'route archived more than 2 months ago should be hard-deleted';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM route WHERE id = new_id) THEN
    RAISE EXCEPTION 'recently archived route should remain';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM log.history
    WHERE "schemaName" = 'public'
      AND "tableName" = 'route'
      AND operation = 'INSERT'
      AND (record->>'id')::integer = old_id
  ) THEN
    RAISE EXCEPTION 'hard-delete must not wipe INSERT history';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM log.history
    WHERE "schemaName" = 'public'
      AND "tableName" = 'route'
      AND operation = 'DELETE'
      AND "userId" = -1
      AND "userName" = 'system'
      AND (record->>'id')::integer = old_id
  ) THEN
    RAISE EXCEPTION 'hard-delete must append a DELETE history snapshot';
  END IF;
END;
$$;

ROLLBACK;
