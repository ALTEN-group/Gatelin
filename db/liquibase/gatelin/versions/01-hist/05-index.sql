
--
-- Functional index on log.history for entity ID lookups.
-- Queries filter history by CAST(record->>'id' AS INT) which cannot use a standard
-- B-tree index without this explicit functional index.
--
CREATE INDEX IF NOT EXISTS idx_history_record_id
  ON log.history ((CAST(record->>'id' AS INT)));

--
-- Composite index on (schemaName, tableName) to support the typical filter pattern:
--   WHERE "schemaName" = $1 AND "tableName" = $2 AND CAST(record->>'id' AS INT) = $3
--
CREATE INDEX IF NOT EXISTS idx_history_schema_table
  ON log.history ("schemaName", "tableName");
