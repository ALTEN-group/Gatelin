-- Cache view used by the gateway role service at startup
CREATE OR REPLACE VIEW role_cache AS
  SELECT
    r.id,
    r.archived,
    COALESCE(
      jsonb_agg(
        jsonb_build_object('route', pp."routeId", 'operations', pp.ops, 'fields', pp.fields, 'scopes', pp.scopes, 'conditions', pp.conditions)
        ORDER BY pp."routeId"
      ) FILTER (WHERE pp."routeId" IS NOT NULL),
      '[]'::jsonb
    ) AS permissions
  FROM role r
  LEFT JOIN (
    SELECT
      "roleId",
      "routeId",
      array_agg("operationId" ORDER BY "operationId") AS ops,
      (array_agg(fields ORDER BY "operationId") FILTER (WHERE fields IS NOT NULL))[1] AS fields,
      (array_agg(scopes ORDER BY "operationId") FILTER (WHERE scopes IS NOT NULL))[1] AS scopes,
      (array_agg(conditions ORDER BY "operationId") FILTER (WHERE conditions IS NOT NULL))[1] AS conditions
    FROM permission
    GROUP BY "roleId", "routeId"
  ) pp ON pp."roleId" = r.id
  GROUP BY r.id, r.archived;

-- Management view: one row per (roleId, routeId), always filtered by roleId
CREATE OR REPLACE VIEW permissions AS
  SELECT
    p."roleId",
    svc.id                                               AS "serviceId",
    svc.name                                             AS "serviceName",
    res.id                                               AS "resourceId",
    res.name                                             AS "resourceName",
    rt.id                                                AS "routeId",
    rt.name                                              AS "routeName",
    array_agg(p."operationId" ORDER BY p."operationId")  AS "operationId",
    array_agg(o.name          ORDER BY p."operationId")  AS "operationName",
    (array_agg(p.fields ORDER BY p."operationId") FILTER (WHERE p.fields IS NOT NULL))[1] AS fields,
    (array_agg(p.scopes ORDER BY p."operationId") FILTER (WHERE p.scopes IS NOT NULL))[1] AS scopes,
    (array_agg(p.conditions ORDER BY p."operationId") FILTER (WHERE p.conditions IS NOT NULL))[1] AS conditions,
    MIN(p."creatorId")   AS "creatorId",
    MIN(p."creatorName") AS "creatorName",
    MAX(p."updaterId")   AS "updaterId",
    MAX(p."updaterName") AS "updaterName",
    MIN(p."createdAt")   AS "createdAt",
    MAX(p."updatedAt")   AS "updatedAt"
  FROM permission p
  LEFT JOIN route     rt  ON rt.id  = p."routeId"
  LEFT JOIN resource  res ON res.id = rt."resourceId"
  LEFT JOIN service   svc ON svc.id = res."serviceId"
  LEFT JOIN operation o   ON o.id   = p."operationId"
  GROUP BY p."roleId", svc.id, svc.name, res.id, res.name, rt.id, rt.name
  ORDER BY svc.name ASC, res.name ASC, rt.name ASC;
