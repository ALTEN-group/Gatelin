-- Cache view used by the gateway role service at startup.
-- Archived roles are omitted so reloadRoles / init cannot keep their grants live.
CREATE OR REPLACE VIEW role_cache AS
  SELECT
    r.id,
    r.archived,
    r.locked,
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
    WHERE p."roleId" = r.id AND p.active = TRUE
    GROUP BY p."routeId"
  ) rp ON TRUE
  WHERE r.archived IS NOT TRUE
  GROUP BY r.id, r.archived, r.locked;
