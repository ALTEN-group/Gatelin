
-- Function to get table history with distinct records per operation
-- This is used by WITH history pattern in views
-- Keeps only the most recent history record per record ID and operation
CREATE OR REPLACE FUNCTION get_history(
  p_schema_name TEXT,
  p_table_name TEXT
) RETURNS TABLE (
  id INT,
  operation TEXT,
  tstamp TIMESTAMP,
  "consumerId" INT,
  "consumerName" TEXT
) AS '
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (CAST(record->>''id'' AS INT), lh.operation) 
    CAST(record->>''id'' AS INT) AS id,
    lh.operation,
    lh.tstamp,
    lh."consumerId",
    lh."consumerName"
  FROM log.history lh
  WHERE (lh."schemaName", lh."tableName") = (p_schema_name, p_table_name)
  ORDER BY CAST(record->>''id'' AS INT), lh.operation, lh.tstamp DESC;
END;
' LANGUAGE plpgsql;
