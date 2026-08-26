BEGIN;

DO $$
DECLARE
  route_id integer;
  resource_id integer;
  operation_id integer;
  method_id integer;
BEGIN
  SELECT id INTO STRICT resource_id FROM resource WHERE name = 'routes';
  SELECT id INTO STRICT operation_id FROM operation WHERE name = 'read';
  SELECT id INTO STRICT method_id FROM method WHERE name = 'GET';

  INSERT INTO routes (
    "resourceId",
    pattern,
    name,
    description,
    protected,
    "operationId",
    "methodIds",
    "creatorId",
    "creatorName"
  )
  VALUES (
    resource_id,
    '/db-contract',
    'dbContractRoute',
    'PostgreSQL contract test',
    true,
    ARRAY[operation_id],
    ARRAY[method_id],
    9001,
    'db-test'
  )
  RETURNING id INTO route_id;

  IF NOT EXISTS (
    SELECT 1
    FROM routes
    WHERE id = route_id
      AND name = 'dbContractRoute'
      AND "operationId" @> ARRAY[operation_id]
      AND "methodIds" @> ARRAY[method_id]
      AND "creatorId" = 9001
  ) THEN
    RAISE EXCEPTION 'route inserted through the view was not readable with its associations';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM route
    WHERE id = route_id
      AND name = 'dbContractRoute'
  ) THEN
    RAISE EXCEPTION 'route view insert did not write the base table';
  END IF;
END;
$$;

ROLLBACK;
