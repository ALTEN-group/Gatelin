
-- create log schema for history
CREATE SCHEMA IF NOT EXISTS log;
SET search_path TO log;

--
-- create history table
--
CREATE TABLE IF NOT EXISTS log.history (
  id             serial,
  tstamp         timestamp DEFAULT now(),
  "schemaName"   text,
  "tableName"    text,
  operation      text,
  "dbUser"       text DEFAULT current_user,
  -- user generating this history record
  "consumerId"   int NOT NULL,
  "consumerName" text NOT NULL,
  record         jsonb
);

-- DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA IF NOT EXISTS public;
SET search_path TO public;

--
-- create trigger function to save history on changes
--
CREATE OR REPLACE FUNCTION change_trigger() RETURNS trigger AS '
BEGIN
  IF TG_OP = ''INSERT'' THEN
    INSERT INTO log.history ("schemaName", "tableName", operation, "consumerId", "consumerName", record)
      VALUES (TG_TABLE_SCHEMA, TG_RELNAME, TG_OP, NEW."creatorId", NEW."creatorName", row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = ''UPDATE'' THEN
    INSERT INTO log.history ("schemaName", "tableName", operation, "consumerId", "consumerName", record)
      VALUES (TG_TABLE_SCHEMA, TG_RELNAME, TG_OP, NEW."updaterId", NEW."updaterName", row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = ''DELETE'' THEN
    DELETE FROM log.history 
      WHERE "schemaName" = TG_TABLE_SCHEMA
      AND "tableName" = TG_RELNAME
      AND CAST(record->>''id'' AS INT) = OLD.id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
' LANGUAGE 'plpgsql' SECURITY DEFINER;

