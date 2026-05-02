-- Cache view used by the gateway role service at startup
CREATE OR REPLACE VIEW role_cache AS
  SELECT
    r.id,
    r.archived,
    COALESCE(
      jsonb_agg(
        jsonb_build_object('route', p."routeId", 'operations', ops.ids, 'fields', p.fields, 'scopes', p.scopes, 'conditions', conds.data)
        ORDER BY p."routeId"
      ) FILTER (WHERE p."routeId" IS NOT NULL),
      '[]'::jsonb
    ) AS permissions
  FROM role r
  LEFT JOIN permission p ON p."roleId" = r.id
  LEFT JOIN LATERAL (
    SELECT array_agg(po."operationId" ORDER BY po."operationId") AS ids
    FROM permission_operation po
    WHERE po."permissionId" = p.id
  ) ops ON TRUE
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      jsonb_build_object('field', f.name, 'op', c.op, 'value', c.value)
      ORDER BY c.id
    ) AS data
    FROM permission_condition pc
    JOIN condition c ON c.id = pc."conditionId"
    JOIN field f ON f.id = c."fieldId"
    WHERE pc."permissionId" = p.id
  ) conds ON TRUE
  GROUP BY r.id, r.archived;

-- Management view: one row per (roleId, routeId)
CREATE OR REPLACE VIEW permissions AS
  SELECT
    p."roleId",
    svc.id                   AS "serviceId",
    svc.name                 AS "serviceName",
    res.id                   AS "resourceId",
    res.name                 AS "resourceName",
    rt.id                    AS "routeId",
    rt.name                  AS "routeName",
    ops."operationId",
    ops."operationName",
    p.fields,
    p.scopes,
    conds."conditionId",
    conds."conditionName",
    p."creatorId",
    p."creatorName",
    p."updaterId",
    p."updaterName",
    p."createdAt",
    p."updatedAt"
  FROM permission p
  LEFT JOIN route     rt  ON rt.id  = p."routeId"
  LEFT JOIN resource  res ON res.id = rt."resourceId"
  LEFT JOIN service   svc ON svc.id = res."serviceId"
  LEFT JOIN LATERAL (
    SELECT
      array_agg(po."operationId" ORDER BY po."operationId") AS "operationId",
      array_agg(o.name           ORDER BY po."operationId") AS "operationName"
    FROM permission_operation po
    JOIN operation o ON o.id = po."operationId"
    WHERE po."permissionId" = p.id
  ) ops ON TRUE
  LEFT JOIN LATERAL (
    SELECT
      array_agg(pc."conditionId" ORDER BY pc."conditionId") AS "conditionId",
      array_agg(c.name           ORDER BY pc."conditionId") AS "conditionName"
    FROM permission_condition pc
    JOIN condition c ON c.id = pc."conditionId"
    WHERE pc."permissionId" = p.id
  ) conds ON TRUE
  ORDER BY svc.name ASC, res.name ASC, rt.name ASC;
