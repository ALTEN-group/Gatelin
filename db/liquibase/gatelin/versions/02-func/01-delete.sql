-- Hard-delete rows whose archivedAt is before the cutoff.
-- History is left in place; the delete-old-history job ages it out.
-- p_schema_name is kept so callers can stay SELECT delete($1, $2, $3).
-- Return type changed from VOID: CREATE OR REPLACE cannot alter it.
DROP FUNCTION IF EXISTS delete(TEXT, TEXT, TIMESTAMP);

CREATE FUNCTION delete(
  p_schema_name TEXT,
  p_table_name TEXT,
  p_archived_at TIMESTAMP
) RETURNS INTEGER AS $$
DECLARE
  n INT;
BEGIN
  EXECUTE format('DELETE FROM %I WHERE "archivedAt" < $1', p_table_name)
    USING p_archived_at;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;

-- Example usage:
-- SELECT delete('public', 'user', NOW() - INTERVAL '2 months');
