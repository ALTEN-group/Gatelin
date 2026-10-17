BEGIN;

DO $$
DECLARE
  route_id integer;
BEGIN
  SELECT r.id INTO route_id
  FROM routes r
  WHERE r."serviceName" = 'gatelin'
  ORDER BY r.id
  LIMIT 1;

  IF (SELECT "forwardedCookies" FROM routes WHERE id = route_id) IS DISTINCT FROM '{}'::text[] THEN
    RAISE EXCEPTION 'forwardedCookies must be empty until a service registers cookies';
  END IF;

  UPDATE service
  SET "forwardedCookies" = ARRAY['app_csrf'],
      "updaterId" = 9001,
      "updaterName" = 'db-test'
  WHERE name = 'gatelin';

  IF (SELECT "forwardedCookies" FROM routes WHERE id = route_id) IS DISTINCT FROM ARRAY['app_csrf'] THEN
    RAISE EXCEPTION 'routes view does not expose the service forwardedCookies';
  END IF;
END;
$$;

ROLLBACK;
