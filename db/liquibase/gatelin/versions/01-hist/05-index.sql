-- History API:
--   WHERE "schemaName" = $1
--     AND "tableName" = ANY($2)
--     AND CAST(record->>'id' AS INT) = $3
-- The jsonb id is not a real column, so it has to be a functional key.
DROP INDEX IF EXISTS log.idx_history_record_id;
DROP INDEX IF EXISTS log.idx_history_schema_table;

CREATE INDEX IF NOT EXISTS idx_history_lookup
  ON log.history (
    "schemaName",
    "tableName",
    (CAST(record->>'id' AS INT))
  );

-- Age-out job: DELETE FROM log.history WHERE tstamp < $1
CREATE INDEX IF NOT EXISTS idx_history_tstamp
  ON log.history (tstamp);
