-- Cache view used by the gateway role service at startup
CREATE OR REPLACE VIEW role_cache AS
  SELECT
    r.id,
    r.archived,
    COALESCE(
      jsonb_agg(
        jsonb_build_object('route', pp."routeId", 'operations', pp.ops, 'fields', pp.fields)
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
      (array_agg(fields ORDER BY "operationId") FILTER (WHERE fields IS NOT NULL))[1] AS fields
    FROM permission
    GROUP BY "roleId", "routeId"
  ) pp ON pp."roleId" = r.id
  GROUP BY r.id, r.archived;

-- Management view: groups by (roleId, routeId), ordered by service then resource
CREATE OR REPLACE VIEW permissions AS
  SELECT
    MIN(p.id)                                           AS id,
    p."roleId",
    p."routeId",
    svc.name                                            AS "serviceName",
    res.name                                            AS "resourceName",
    rt.name                                             AS "routeName",
    array_agg(p."operationId" ORDER BY p."operationId") AS "operationId",
    array_agg(o.name         ORDER BY p."operationId") AS "operationName",
    (array_agg(p.fields ORDER BY p."operationId") FILTER (WHERE p.fields IS NOT NULL))[1] AS fields,
    false::BOOLEAN    AS archived,
    NULL::TIMESTAMP   AS "archivedAt"
  FROM permission p
  LEFT JOIN route     rt  ON rt.id  = p."routeId"
  LEFT JOIN resource  res ON res.id = rt."resourceId"
  LEFT JOIN service   svc ON svc.id = res."serviceId"
  LEFT JOIN operation o   ON o.id   = p."operationId"
  GROUP BY p."roleId", p."routeId", svc.id, svc.name, res.id, res.name, rt.name
  ORDER BY p."roleId" ASC, svc.name ASC, res.name ASC, rt.name ASC;
