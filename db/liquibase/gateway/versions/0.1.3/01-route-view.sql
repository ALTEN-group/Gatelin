
create or replace view routes AS
  WITH history AS (
    SELECT * FROM get_history('public', 'route')
  )
  SELECT r.id, 
  r."serviceId",
  r."apiId",
  a.name as "apiName",
  s.name as "serviceName",
  r.action as "route",
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
  -- array_agg(DISTINCT p."roleId" ORDER BY p."roleId" ASC) FILTER (WHERE (p."roleId" IS NOT NULL)) AS "rolesArrayAgg" 
  FROM "route" AS r
  -- LEFT OUTER JOIN "access" as a ON a."routeId" = r.id 
  LEFT OUTER JOIN "service" as s ON r."serviceId" = s.id 
  LEFT OUTER JOIN "api" as a ON r."apiId" = a.id 
  -- LEFT OUTER JOIN "permission" as p ON p."functionalityId" = r."functionalityId" AND p."operationId" = a."operationId" 
  LEFT JOIN history h ON (h.id, h.operation) = (r.id, 'UPDATE')
  LEFT JOIN history h2 ON (h2.id, h2.operation) = (r.id, 'INSERT')
  GROUP BY r.id, a.name, s.name,
  h.tstamp, h."consumerId", h."consumerName", 
  h2.tstamp, h2."consumerId", h2."consumerName"
  ORDER BY r.id ASC
;