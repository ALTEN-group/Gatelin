
create or replace view routes AS
  SELECT r.id,
  b."serviceId",
  s.name as "serviceName",
  r."resourceId",
  b.name as "resourceName",
  array_agg(DISTINCT ro."operationId") FILTER (WHERE ro."operationId" IS NOT NULL) as "operationId",
  array_agg(DISTINCT o.name) FILTER (WHERE o.name IS NOT NULL) as "operationName",
  r.pattern,
  CASE WHEN COALESCE(s.pattern, '') = ''
    THEN '/' || b.name || r.pattern
    ELSE '/' || s.pattern || '/' || b.name || r.pattern
  END as "url",
  r.name,
  r.description,
  COALESCE(array_agg(DISTINCT rm."methodId") FILTER (WHERE rm."methodId" IS NOT NULL), ARRAY[]::int[]) as "methodIds",
  COALESCE(array_agg(DISTINCT mc.name) FILTER (WHERE mc.name IS NOT NULL), ARRAY[]::text[]) as "methodNames",
  r.protected,
  r.core,
  r.archived,
  r."updatedAt",
  r."updaterId",
  r."updaterName",
  r."createdAt",
  r."creatorId",
  r."creatorName"
  FROM "route" AS r
  LEFT OUTER JOIN "resource" as b ON r."resourceId" = b.id
  LEFT OUTER JOIN "service" as s ON b."serviceId" = s.id
  LEFT JOIN route_operation ro ON ro."routeId" = r.id
  LEFT JOIN operation o ON o.id = ro."operationId"
  LEFT JOIN route_method rm ON rm."routeId" = r.id
  LEFT JOIN method mc ON mc.id = rm."methodId"
  GROUP BY r.id, b."serviceId", s.name, b.name, s.pattern, r."resourceId"
  ORDER BY r.id ASC
;
