BEGIN;

DO $$
DECLARE
  route_id integer;
  resource_id integer;
BEGIN
  SELECT id INTO STRICT resource_id FROM resource WHERE name = 'routes';

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
    '/db-history-contract',
    'dbHistoryContractRoute',
    true,
    9001,
    'db-test'
  )
  RETURNING id INTO route_id;

  IF NOT EXISTS (
    SELECT 1
    FROM log.history
    WHERE "schemaName" = 'public'
      AND "tableName" = 'route'
      AND operation = 'INSERT'
      AND "userId" = 9001
      AND "userName" = 'db-test'
      AND (record->>'id')::integer = route_id
  ) THEN
    RAISE EXCEPTION 'route insert did not create the expected history record';
  END IF;

  UPDATE routes
  SET description = 'Updated by PostgreSQL contract test',
      "updaterId" = 9002,
      "updaterName" = 'db-test-update'
  WHERE id = route_id;

  IF NOT EXISTS (
    SELECT 1
    FROM log.history
    WHERE "schemaName" = 'public'
      AND "tableName" = 'route'
      AND operation = 'UPDATE'
      AND "userId" = 9002
      AND "userName" = 'db-test-update'
      AND (record->>'id')::integer = route_id
  ) THEN
    RAISE EXCEPTION 'route update did not create the expected history record';
  END IF;
END;
$$;

ROLLBACK;
