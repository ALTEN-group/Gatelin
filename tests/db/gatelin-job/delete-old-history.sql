BEGIN;

DO $$
DECLARE
  old_id integer;
  new_id integer;
BEGIN
  INSERT INTO log.history (
    tstamp,
    "schemaName",
    "tableName",
    operation,
    "userId",
    "userName",
    record
  )
  VALUES (
    NOW() - INTERVAL '7 months',
    'public',
    'route',
    'INSERT',
    9001,
    'db-job-test',
    '{"id": -701}'::jsonb
  )
  RETURNING id INTO old_id;

  INSERT INTO log.history (
    tstamp,
    "schemaName",
    "tableName",
    operation,
    "userId",
    "userName",
    record
  )
  VALUES (
    NOW() - INTERVAL '1 day',
    'public',
    'route',
    'INSERT',
    9001,
    'db-job-test',
    '{"id": -702}'::jsonb
  )
  RETURNING id INTO new_id;

  DELETE FROM log.history WHERE tstamp < NOW() - INTERVAL '6 months';

  IF EXISTS (SELECT 1 FROM log.history WHERE id = old_id) THEN
    RAISE EXCEPTION 'history older than 6 months should be deleted';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM log.history WHERE id = new_id) THEN
    RAISE EXCEPTION 'recent history should remain';
  END IF;
END;
$$;

ROLLBACK;
