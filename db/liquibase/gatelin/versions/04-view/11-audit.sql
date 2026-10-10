-- Read model for the admin audit-log page: one row per audited write, enriched
-- with the previous snapshot of the record (UPDATE only) and the columns that changed.
--
-- Filtering the view by tstamp is pushed down into log.history, so the LATERAL
-- lookups (idx_history_lookup) only run for the rows that survive the filters.
--
-- record/previous hold raw snapshots. They are for the service layer only,
-- which redacts them (see src/middlewares/mappers/audit-changes.js).
CREATE OR REPLACE VIEW log.audit AS
  SELECT
    h.id,
    h.tstamp,
    h."tableName",
    h.operation,
    CASE
      WHEN h.operation = 'UPDATE' AND 'archived' = ANY (c.keys) THEN
        CASE WHEN h.record->>'archived' = 'true' THEN 'ARCHIVE' ELSE 'RESTORE' END
      ELSE h.operation
    END AS action,
    h."userId",
    h."userName",
    CAST(h.record->>'id' AS INT) AS "recordId",
    c.keys AS "changedKeys",
    h.record,
    p.record AS previous
  FROM log.history AS h
  LEFT JOIN LATERAL (
    SELECT ph.record
    FROM log.history AS ph
    WHERE ph."schemaName" = h."schemaName"
      AND ph."tableName" = h."tableName"
      AND CAST(ph.record->>'id' AS INT) = CAST(h.record->>'id' AS INT)
      AND (ph.tstamp, ph.id) < (h.tstamp, h.id)
    ORDER BY ph.tstamp DESC, ph.id DESC
    LIMIT 1
  ) AS p ON h.operation = 'UPDATE'
  CROSS JOIN LATERAL (
    SELECT COALESCE(array_agg(k ORDER BY k), ARRAY[]::text[]) AS keys
    FROM jsonb_object_keys(h.record) AS k
    WHERE k NOT IN ('updatedAt', 'updaterId', 'updaterName')
      AND h.record->k IS DISTINCT FROM p.record->k
  ) AS c
  WHERE h."schemaName" = 'public'
;
