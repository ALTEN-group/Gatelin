
create or replace view routes AS
  WITH history AS (
    SELECT * FROM get_history('public', 'route')
  )
  SELECT r.id, 
  b."serviceId",
  s.name as "serviceName",
  r."resourceId",
  b.name as "resourceName",
  array_agg(DISTINCT ro."operationId") FILTER (WHERE ro."operationId" IS NOT NULL) as operations,
  r.pattern,
  '/' || COALESCE(s.pattern, '') || '/' || b.name || r.pattern as "url",
  r.name,
  r.description, 
  array_to_json(r.methods) as methods,
  r."isProtected",
  r.locked,
  r.archived,
  h.tstamp AS "updatedAt",
  h."consumerId" AS "updaterId",
  h."consumerName" AS "updaterName",
  h2.tstamp AS "createdAt",
  h2."consumerId" AS "creatorId",
  h2."consumerName" AS "creatorName"
  FROM "route" AS r
  LEFT OUTER JOIN "resource" as b ON r."resourceId" = b.id
  LEFT OUTER JOIN "service" as s ON b."serviceId" = s.id 
  LEFT JOIN route_operation ro ON ro."routeId" = r.id
  LEFT JOIN history h ON (h.id, h.operation) = (r.id, 'UPDATE')
  LEFT JOIN history h2 ON (h2.id, h2.operation) = (r.id, 'INSERT')
  GROUP BY r.id, b."serviceId", s.name, b.name, s.pattern, r."resourceId", r.description, r.pattern, r.methods, r."isProtected", r.locked,
  h.tstamp, h."consumerId", h."consumerName", 
  h2.tstamp, h2."consumerId", h2."consumerName"
  ORDER BY r.id ASC
;