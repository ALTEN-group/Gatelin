create or replace view apis AS
  WITH history AS (
    SELECT * FROM get_history('public', 'api')
  )
  SELECT a.id, 
  a."serviceId",
  s.name as "serviceName",
  a.name,
  a.protected,
  h.tstamp AS "updatedAt",
  h."consumerId" AS "updaterId",
  h."consumerName" AS "updaterName",
  h2.tstamp AS "createdAt",
  h2."consumerId" AS "creatorId",
  h2."consumerName" AS "creatorName"
  FROM "api" AS a
  LEFT OUTER JOIN "service" as s ON a."serviceId" = s.id 
  LEFT JOIN history h ON (h.id, h.operation) = (a.id, 'UPDATE')
  LEFT JOIN history h2 ON (h2.id, h2.operation) = (a.id, 'INSERT')
  GROUP BY a.id, s.name,
  h.tstamp, h."consumerId", h."consumerName", 
  h2.tstamp, h2."consumerId", h2."consumerName"
  ORDER BY a.id ASC
;
