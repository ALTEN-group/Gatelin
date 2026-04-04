CREATE OR REPLACE VIEW scopes AS
  WITH history AS (
    SELECT * FROM get_history('public', 'scope')
  )
  SELECT
    s.id,
    s."routeId",
    r.name AS "routeName",
    s.name,
    s.archived,
    s."archivedAt",
    h.tstamp AS "updatedAt",
    h."consumerId" AS "updaterId",
    h."consumerName" AS "updaterName",
    h2.tstamp AS "createdAt",
    h2."consumerId" AS "creatorId",
    h2."consumerName" AS "creatorName"
  FROM scope AS s
  LEFT JOIN route AS r ON r.id = s."routeId"
  LEFT JOIN history h ON (h.id, h.operation) = (s.id, 'UPDATE')
  LEFT JOIN history h2 ON (h2.id, h2.operation) = (s.id, 'INSERT')
  ORDER BY s.id ASC
;
