create or replace view resources AS
  WITH history AS (
    SELECT * FROM get_history('public', 'resource')
  )
  SELECT r.id, 
  r."serviceId",
  s.name as "serviceName",
  r.name,
  r.locked,
  h.tstamp AS "updatedAt",
  h."consumerId" AS "updaterId",
  h."consumerName" AS "updaterName",
  h2.tstamp AS "createdAt",
  h2."consumerId" AS "creatorId",
  h2."consumerName" AS "creatorName"
  FROM "resource" AS r
  LEFT OUTER JOIN "service" as s ON r."serviceId" = s.id 
  LEFT JOIN history h ON (h.id, h.operation) = (r.id, 'UPDATE')
  LEFT JOIN history h2 ON (h2.id, h2.operation) = (r.id, 'INSERT')
  GROUP BY r.id, s.name,
  h.tstamp, h."consumerId", h."consumerName", 
  h2.tstamp, h2."consumerId", h2."consumerName"
  ORDER BY r.id ASC
;
