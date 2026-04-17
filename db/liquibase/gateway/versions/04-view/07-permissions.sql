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

-- Management view: joins route and operation names for display in the admin datagrid
CREATE OR REPLACE VIEW permissions AS
  SELECT
    p.id,
    p."roleId",
    p."routeId",
    rt.name AS "routeName",
    p."operationId",
    o.name  AS "operationName",
    p.fields,
    false::BOOLEAN    AS archived,
    NULL::TIMESTAMP   AS "archivedAt"
  FROM permission p
  LEFT JOIN route     rt ON rt.id = p."routeId"
  LEFT JOIN operation o  ON o.id  = p."operationId"
  ORDER BY p."roleId" ASC, p."routeId" ASC;
