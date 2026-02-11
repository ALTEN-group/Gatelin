
create or replace view routes AS
  WITH history AS (
    SELECT * FROM get_history('public', 'route')
  )
  SELECT r.id, 
  a."serviceId",
  s.name as "serviceName",
  r."resourceId",
  b.name as "resourceName",
  r."operationId",
  o.name as "operationName",
  r.description, 
  r.pattern,
  r.methods,
  r.jwt,
  r.protected,
  h.tstamp AS "updatedAt",
  h."consumerId" AS "updaterId",
  h."consumerName" AS "updaterName",
  h2.tstamp AS "createdAt",
  h2."consumerId" AS "creatorId",
  h2."consumerName" AS "creatorName"
  FROM "route" AS r
  LEFT OUTER JOIN "resource" as b ON r."resourceId" = b.id
  LEFT OUTER JOIN "service" as s ON b."serviceId" = s.id 
  LEFT OUTER JOIN "operation" as o ON r."operationId" = o.id 
  LEFT JOIN history h ON (h.id, h.operation) = (r.id, 'UPDATE')
  LEFT JOIN history h2 ON (h2.id, h2.operation) = (r.id, 'INSERT')
  GROUP BY r.id, a.name, s.name,
  h.tstamp, h."consumerId", h."consumerName", 
  h2.tstamp, h2."consumerId", h2."consumerName"
  ORDER BY r.id ASC
;