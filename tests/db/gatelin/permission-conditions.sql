BEGIN;

DO $$
DECLARE
  route_id integer;
  resource_id integer;
  role_id integer;
  read_id integer;
  create_id integer;
  perm_id integer;
  cond_a integer;
  cond_b integer;
BEGIN
  SELECT id INTO STRICT resource_id FROM resource WHERE name = 'routes';
  SELECT id INTO STRICT role_id FROM role WHERE name = 'Gatelin guest';
  SELECT id INTO STRICT read_id FROM operation WHERE name = 'read';
  SELECT id INTO STRICT create_id FROM operation WHERE name = 'create';
  SELECT id INTO STRICT cond_a FROM condition WHERE name = 'Non-archived only';
  SELECT id INTO STRICT cond_b FROM condition WHERE name = 'Non-core only';

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
    '/db-permission-contract',
    'dbPermissionContractRoute',
    true,
    9001,
    'db-test'
  )
  RETURNING id INTO route_id;

  INSERT INTO permissions (
    "roleId",
    "routeId",
    "operationId",
    fields,
    scopes,
    "conditionId",
    "creatorId",
    "creatorName"
  )
  VALUES (
    role_id,
    route_id,
    read_id,
    ARRAY[]::text[],
    ARRAY[]::text[],
    ARRAY[cond_a],
    9001,
    'db-test'
  );

  SELECT id INTO STRICT perm_id
  FROM permission
  WHERE "roleId" = role_id
    AND "routeId" = route_id
    AND "operationId" = read_id;

  IF NOT EXISTS (
    SELECT 1
    FROM permission_condition
    WHERE "permissionId" = perm_id
      AND "conditionId" = cond_a
  ) THEN
    RAISE EXCEPTION 'permission insert did not write permission_condition';
  END IF;

  UPDATE permissions
  SET
    "conditionId" = ARRAY[cond_b],
    "updaterId" = 9002,
    "updaterName" = 'db-test-replace'
  WHERE id = perm_id;

  IF EXISTS (
    SELECT 1
    FROM permission_condition
    WHERE "permissionId" = perm_id
      AND "conditionId" = cond_a
  ) THEN
    RAISE EXCEPTION 'permission update did not replace the previous condition';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM permission_condition
    WHERE "permissionId" = perm_id
      AND "conditionId" = cond_b
  ) THEN
    RAISE EXCEPTION 'permission update did not insert the new condition';
  END IF;

  UPDATE permissions
  SET
    "conditionId" = NULL,
    "updaterId" = 9003,
    "updaterName" = 'db-test-clear'
  WHERE id = perm_id;

  IF EXISTS (
    SELECT 1
    FROM permission_condition
    WHERE "permissionId" = perm_id
  ) THEN
    RAISE EXCEPTION 'null conditionId on update did not clear permission_condition';
  END IF;

  BEGIN
    INSERT INTO permissions (
      "roleId",
      "routeId",
      "operationId",
      "creatorId",
      "creatorName"
    )
    VALUES (
      role_id,
      route_id,
      read_id,
      9004,
      'db-test-unique'
    );
    RAISE EXCEPTION 'duplicate permission (role, route, operation) was accepted';
  EXCEPTION
    WHEN unique_violation THEN
      NULL;
  END;

  INSERT INTO permissions (
    "roleId",
    "routeId",
    "operationId",
    "creatorId",
    "creatorName"
  )
  VALUES (
    role_id,
    route_id,
    create_id,
    9005,
    'db-test-other-op'
  );
END;
$$;

ROLLBACK;
