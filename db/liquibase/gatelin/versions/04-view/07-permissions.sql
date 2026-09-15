-- Management view: one row per (roleId, routeId, operationId)
CREATE OR REPLACE VIEW permissions AS
  SELECT
    p.id,
    p."roleId",
    svc.id   AS "serviceId",
    svc.name AS "serviceName",
    res.id   AS "resourceId",
    res.name AS "resourceName",
    p."routeId",
    rt.name  AS "routeName",
    rt.protected AS "routeProtected",
    p."operationId",
    o.name   AS "operationName",
    p.active,
    p.fields,
    p.scopes,
    COALESCE(array_agg(DISTINCT pc."conditionId") FILTER (WHERE pc."conditionId" IS NOT NULL), ARRAY[]::int[])   AS "conditionId",
    COALESCE(array_agg(DISTINCT c.name)           FILTER (WHERE c.name IS NOT NULL),           ARRAY[]::text[])  AS "conditionName",
    p."creatorId",
    p."creatorName",
    p."updaterId",
    p."updaterName",
    p."createdAt",
    p."updatedAt"
  FROM permission p
  LEFT JOIN route               rt  ON rt.id  = p."routeId"
  LEFT JOIN resource            res ON res.id = rt."resourceId"
  LEFT JOIN service             svc ON svc.id = res."serviceId"
  LEFT JOIN operation           o   ON o.id   = p."operationId"
  LEFT JOIN permission_condition pc ON pc."permissionId" = p.id
  LEFT JOIN condition            c  ON c.id   = pc."conditionId"
  GROUP BY p.id, p."routeId", p.active, svc.id, svc.name, res.id, res.name, rt.name, rt.protected, o.name
  ORDER BY svc.name ASC, res.name ASC, rt.name ASC, p."operationId" ASC;