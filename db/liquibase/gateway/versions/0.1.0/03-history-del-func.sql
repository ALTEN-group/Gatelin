
-- Function to delete history records
CREATE OR REPLACE FUNCTION delete_history(
  p_schema_name TEXT,
  p_table_name TEXT, 
  p_record_id INT
) RETURNS VOID AS '
BEGIN
  DELETE FROM log.history 
  WHERE "schemaName" = p_schema_name
    AND "tableName" = p_table_name
    AND CAST(record->>''id'' AS INT) = p_record_id;
END;
' LANGUAGE plpgsql SECURITY DEFINER;
