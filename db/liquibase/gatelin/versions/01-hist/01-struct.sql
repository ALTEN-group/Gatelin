
-- create log schema for history
CREATE SCHEMA IF NOT EXISTS log;
SET search_path TO log;

--
-- create history table
--
CREATE TABLE IF NOT EXISTS log.history (
  id                serial PRIMARY KEY,
  tstamp            timestamp DEFAULT now(),
  "schemaName"      text,
  "tableName"       text,
  operation         text,
  "dbUser"          text DEFAULT session_user,
  -- user generating this history record
  "userId"  int NULL,
  "userName"    text DEFAULT 'system',
  record            jsonb
);

CREATE SCHEMA IF NOT EXISTS public;
SET search_path TO public;
