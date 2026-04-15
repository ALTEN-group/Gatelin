
-- Create a reusable function for hard deleting any record
-- This function handles the common pattern of hard deletes without code duplication
-- and cleans up related history records

-- Function to hard delete records by archivedAt and delete history for each
CREATE OR REPLACE FUNCTION delete(
  p_schema_name TEXT,
  p_table_name TEXT,
  p_archived_at TIMESTAMP
) RETURNS VOID AS $$
DECLARE
  rec RECORD;
  sql TEXT;
BEGIN
  sql := format('SELECT id FROM %I WHERE "archivedAt" < $1', p_table_name);
  FOR rec IN EXECUTE sql USING p_archived_at LOOP
    PERFORM delete_history(p_schema_name, p_table_name, rec.id);
    EXECUTE format('DELETE FROM %I WHERE id = $1', p_table_name) USING rec.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example usage:
-- Clean up users archived more than 1 year ago
-- SELECT delete('public', 'user', NOW() - INTERVAL '1 year');
