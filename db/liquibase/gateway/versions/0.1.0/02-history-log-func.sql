
-- DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA IF NOT EXISTS public;
SET search_path TO public;

-- Function to insert records into history log
-- This centralizes the history logging logic
-- Using JSON objects instead of record types to avoid type casting issues
CREATE OR REPLACE FUNCTION log_history(
  p_schema_name TEXT,
  p_table_name TEXT, 
  p_operation TEXT,
  record_new JSON
) RETURNS VOID AS '
DECLARE
  v_consumer_id INT;
  v_consumer_name TEXT;
BEGIN
  -- Extract consumer ID and name directly from JSON records
  v_consumer_id := (record_new->>''consumerId'')::INT;
  v_consumer_name := record_new->>''consumerName'';

  -- Validate that consumer information is provided
  IF v_consumer_id IS NULL THEN
    RAISE EXCEPTION ''"consumerId" is required for tracked operations.'';
  END IF;
  
  IF v_consumer_name IS NULL THEN
    RAISE EXCEPTION ''"consumerName" is required for tracked operations.'';
  END IF;

  INSERT INTO log.history ("tableName", "schemaName", operation, "consumerId", "consumerName", record)
    VALUES (p_table_name, p_schema_name, p_operation, v_consumer_id, v_consumer_name, record_new);
END;
' LANGUAGE plpgsql SECURITY DEFINER;
