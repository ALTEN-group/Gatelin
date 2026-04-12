
create or replace view routes AS
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
  r."updatedAt",
  r."updaterId",
  r."updaterName",
  r."createdAt",
  r."creatorId",
  r."creatorName",
  NULL::INT  AS "consumerId",
  NULL::TEXT AS "consumerName"
  FROM "route" AS r
  LEFT OUTER JOIN "resource" as b ON r."resourceId" = b.id
  LEFT OUTER JOIN "service" as s ON b."serviceId" = s.id
  LEFT JOIN route_operation ro ON ro."routeId" = r.id
  GROUP BY r.id, b."serviceId", s.name, b.name, s.pattern, r."resourceId"
  ORDER BY r.id ASC
;
