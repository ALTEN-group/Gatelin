BEGIN;

DO $$
DECLARE
  cors_id integer;
  r record;
BEGIN
  INSERT INTO cors (name, description, "creatorId", "creatorName")
  VALUES ('dbAuditViewCors', 'before', 9101, 'audit-creator')
  RETURNING id INTO cors_id;

  UPDATE cors
  SET description = 'after', "updaterId" = 9102, "updaterName" = 'audit-editor'
  WHERE id = cors_id;

  -- Bookkeeping-only write: nothing meaningful changed.
  UPDATE cors
  SET "updatedAt" = NOW(), "updaterId" = 9103, "updaterName" = 'audit-bot'
  WHERE id = cors_id;

  UPDATE cors
  SET archived = TRUE, "updaterId" = 9104, "updaterName" = 'audit-archiver'
  WHERE id = cors_id;

  UPDATE cors
  SET archived = FALSE, "updaterId" = 9105, "updaterName" = 'audit-restorer'
  WHERE id = cors_id;

  SELECT * INTO r FROM log.audit
  WHERE "tableName" = 'cors' AND "recordId" = cors_id AND "userId" = 9101;
  IF r.action <> 'INSERT' OR r.previous IS NOT NULL THEN
    RAISE EXCEPTION 'audit view: INSERT row wrong (action %, previous %)',
      r.action, r.previous;
  END IF;

  SELECT * INTO r FROM log.audit
  WHERE "tableName" = 'cors' AND "recordId" = cors_id AND "userId" = 9102;
  IF r.action <> 'UPDATE'
     OR r."changedKeys" <> ARRAY['description']
     OR r.previous->>'description' <> 'before'
     OR r.record->>'description' <> 'after' THEN
    RAISE EXCEPTION 'audit view: UPDATE row wrong (action %, keys %)', r.action, r."changedKeys";
  END IF;

  SELECT * INTO r FROM log.audit
  WHERE "tableName" = 'cors' AND "recordId" = cors_id AND "userId" = 9103;
  IF cardinality(r."changedKeys") <> 0 THEN
    RAISE EXCEPTION 'audit view: bookkeeping-only update must list no changed keys (keys %)', r."changedKeys";
  END IF;

  SELECT * INTO r FROM log.audit
  WHERE "tableName" = 'cors' AND "recordId" = cors_id AND "userId" = 9104;
  IF r.action <> 'ARCHIVE' THEN
    RAISE EXCEPTION 'audit view: expected ARCHIVE, got %', r.action;
  END IF;

  SELECT * INTO r FROM log.audit
  WHERE "tableName" = 'cors' AND "recordId" = cors_id AND "userId" = 9105;
  IF r.action <> 'RESTORE' THEN
    RAISE EXCEPTION 'audit view: expected RESTORE, got %', r.action;
  END IF;
END;
$$;

ROLLBACK;
