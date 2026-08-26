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
    '/db-archive-contract',
    'dbArchiveContractRoute',
    true,
    9001,
    'db-test'
  )
  RETURNING id INTO route_id;

  UPDATE routes
  SET archived = true,
      "updaterId" = 9002,
      "updaterName" = 'db-test-archive'
  WHERE id = route_id;

  IF NOT EXISTS (
    SELECT 1
    FROM route
    WHERE id = route_id
      AND archived = true
      AND "archivedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'archiving through the routes view did not set archived and archivedAt';
  END IF;
END;
$$;

ROLLBACK;
