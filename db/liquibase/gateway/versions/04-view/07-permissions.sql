-- Cache view used by the gateway role service at startup
CREATE OR REPLACE VIEW role_cache AS
  SELECT
    r.id,
    r.archived,
    COALESCE(
      jsonb_agg(
        jsonb_build_object('route', rp."routeId", 'operations', rp.operation_ids, 'fields', rp.fields, 'scopes', rp.scopes, 'conditions', rp.conditions)
        ORDER BY rp."routeId"
      ) FILTER (WHERE rp."routeId" IS NOT NULL),
      '[]'::jsonb
    ) AS permissions
  FROM role r
  LEFT JOIN LATERAL (
    SELECT
      p."routeId",
      MIN(p.fields) AS fields,
      MIN(p.scopes) AS scopes,
      array_agg(p."operationId" ORDER BY p."operationId") AS operation_ids,
      jsonb_agg(DISTINCT jsonb_build_object('field', f.name, 'op', c.op, 'value', c.value)) FILTER (WHERE c.id IS NOT NULL) AS conditions
    FROM permission p
    LEFT JOIN permission_condition pc ON pc."permissionId" = p.id
    LEFT JOIN condition c ON c.id = pc."conditionId"
    LEFT JOIN field f ON f.id = c."fieldId"
    WHERE p."roleId" = r.id
    GROUP BY p."routeId"
  ) rp ON TRUE
  GROUP BY r.id, r.archived;

-- Management view: one row per (roleId, routeId, operationId)
CREATE OR REPLACE VIEW permissions AS
  SELECT
    p."roleId",
    svc.id   AS "serviceId",
    svc.name AS "serviceName",
    res.id   AS "resourceId",
    res.name AS "resourceName",
    rt.id    AS "routeId",
    rt.name  AS "routeName",
    p."operationId",
    o.name   AS "operationName",
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
  GROUP BY p.id, svc.id, svc.name, res.id, res.name, rt.id, rt.name, o.name
  ORDER BY svc.name ASC, res.name ASC, rt.name ASC, p."operationId" ASC;
