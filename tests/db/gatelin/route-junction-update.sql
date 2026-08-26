BEGIN;

DO $$
DECLARE
  route_id integer;
  resource_id integer;
  read_id integer;
  create_id integer;
  get_id integer;
  post_id integer;
BEGIN
  SELECT id INTO STRICT resource_id FROM resource WHERE name = 'routes';
  SELECT id INTO STRICT read_id FROM operation WHERE name = 'read';
  SELECT id INTO STRICT create_id FROM operation WHERE name = 'create';
  SELECT id INTO STRICT get_id FROM method WHERE name = 'GET';
  SELECT id INTO STRICT post_id FROM method WHERE name = 'POST';

  INSERT INTO routes (
    "resourceId",
    pattern,
    name,
    protected,
    "operationId",
    "methodIds",
    "creatorId",
    "creatorName"
  )
  VALUES (
    resource_id,
    '/db-junction-update',
    'dbJunctionUpdateRoute',
    true,
    ARRAY[read_id],
    ARRAY[get_id],
    9001,
    'db-test'
  )
  RETURNING id INTO route_id;

  UPDATE routes
  SET
    description = 'keep junctions',
    "operationId" = NULL,
    "methodIds" = NULL,
    "updaterId" = 9002,
    "updaterName" = 'db-test-keep'
  WHERE id = route_id;

  IF NOT EXISTS (
    SELECT 1
    FROM route_operation
    WHERE "routeId" = route_id
      AND "operationId" = read_id
  ) THEN
    RAISE EXCEPTION 'null operationId on update dropped route_operation rows';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM route_method
    WHERE "routeId" = route_id
      AND "methodId" = get_id
  ) THEN
    RAISE EXCEPTION 'null methodIds on update dropped route_method rows';
  END IF;

  UPDATE routes
  SET
    "operationId" = ARRAY[create_id],
    "methodIds" = ARRAY[post_id],
    "updaterId" = 9003,
    "updaterName" = 'db-test-replace'
  WHERE id = route_id;

  IF EXISTS (
    SELECT 1
    FROM route_operation
    WHERE "routeId" = route_id
      AND "operationId" = read_id
  ) THEN
    RAISE EXCEPTION 'non-null operationId on update did not replace the previous operation';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM route_operation
    WHERE "routeId" = route_id
      AND "operationId" = create_id
  ) THEN
    RAISE EXCEPTION 'non-null operationId on update did not insert the new operation';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM route_method
    WHERE "routeId" = route_id
      AND "methodId" = get_id
  ) THEN
    RAISE EXCEPTION 'non-null methodIds on update did not replace the previous method';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM route_method
    WHERE "routeId" = route_id
      AND "methodId" = post_id
  ) THEN
    RAISE EXCEPTION 'non-null methodIds on update did not insert the new method';
  END IF;
END;
$$;

ROLLBACK;
