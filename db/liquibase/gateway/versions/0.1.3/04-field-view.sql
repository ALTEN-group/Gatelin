CREATE OR REPLACE VIEW fields AS
  WITH history AS (
    SELECT * FROM get_history('public', 'field')
  )
  SELECT
    f.id,
    f."resourceId",
    r.name AS "resourceName",
    f.name,
    f.locked,
    f.archived,
    f."archivedAt",
    h.tstamp AS "updatedAt",
    h."consumerId" AS "updaterId",
    h."consumerName" AS "updaterName",
    h2.tstamp AS "createdAt",
    h2."consumerId" AS "creatorId",
    h2."consumerName" AS "creatorName"
  FROM field AS f
  LEFT JOIN resource AS r ON r.id = f."resourceId"
  LEFT JOIN history h ON (h.id, h.operation) = (f.id, 'UPDATE')
  LEFT JOIN history h2 ON (h2.id, h2.operation) = (f.id, 'INSERT')
  ORDER BY f.id ASC
;
