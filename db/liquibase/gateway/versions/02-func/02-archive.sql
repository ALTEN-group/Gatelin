
-- Create a reusable function for archiving any record
-- This function handles the common pattern of soft deletes without code duplication
CREATE OR REPLACE FUNCTION archive(
  p_table_name TEXT,
  p_id INT,
  p_new_archived BOOLEAN,
  p_old_archived BOOLEAN
) RETURNS VOID AS $$
BEGIN
  EXECUTE format('
    UPDATE %I 
    SET 
      "archivedAt" = CASE WHEN $2 = TRUE AND $3 = FALSE
                          THEN NOW()::timestamp
                     ELSE "archivedAt"
                     END,
      archived = COALESCE($2, archived)
    WHERE id = $1', p_table_name)
  USING p_id, p_new_archived, p_old_archived;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example usage:
-- In a trigger function:
-- PERFORM archive('user', NEW.id, NEW.archived, OLD.archived);
-- PERFORM log_history(TG_TABLE_SCHEMA, TG_RELNAME, TG_OP, row_to_json(OLD), NULL);
-- RETURN OLD;
