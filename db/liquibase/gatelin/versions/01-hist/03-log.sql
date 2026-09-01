-- Function to insert records into history log
-- This centralizes the history logging logic
-- Using JSON objects instead of record types to avoid type casting issues
CREATE OR REPLACE FUNCTION log_history(
  p_schema_name TEXT,
  p_table_name TEXT, 
  p_operation TEXT,
  record_new JSON
) RETURNS VOID AS $$
DECLARE
  v_user_id INT;
  v_user_name TEXT;
BEGIN
  -- INSERT: creator. UPDATE: updater. DELETE: archive job only → system.
  IF p_operation = 'INSERT' THEN
    v_user_id   := (record_new->>'creatorId')::INT;
    v_user_name := record_new->>'creatorName';
  ELSIF p_operation = 'DELETE' THEN
    v_user_id   := -1;
    v_user_name := 'system';
  ELSIF p_operation = 'UPDATE' THEN
    v_user_id   := (record_new->>'updaterId')::INT;
    v_user_name := record_new->>'updaterName';
  ELSE
    RAISE EXCEPTION 'unsupported history operation: %', p_operation;
  END IF;

  -- Validate that user information is provided
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '"userId" is required for tracked operations.';
  END IF;
  
  IF NULLIF(btrim(v_user_name), '') IS NULL THEN
    RAISE EXCEPTION '"userName" is required for tracked operations.';
  END IF;

  INSERT INTO log.history ("tableName", "schemaName", operation, "dbUser", "userId", "userName", record)
    VALUES (p_table_name, p_schema_name, p_operation, session_user, v_user_id, v_user_name, record_new);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;
