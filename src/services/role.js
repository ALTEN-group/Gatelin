// @ts-check
import { execute } from "@dwtechs/antity-pgsql";

const ROLES_WITH_PERMISSIONS_QUERY = `
  SELECT
    r.id, r.name, r.description, r."colorId", r."colorName", r.active,
    r.archived, r."archivedAt", r."creatorName", r."updaterName", r."createdAt", r."updatedAt",
    COALESCE(
      jsonb_agg(
        jsonb_build_object('route', pp."routeId", 'operations', pp.ops, 'fields', pp.fields)
        ORDER BY pp."routeId"
      ) FILTER (WHERE pp."routeId" IS NOT NULL),
      '[]'::jsonb
    ) AS permissions
  FROM roles r
  LEFT JOIN (
    SELECT
      "roleId",
      "routeId",
      array_agg("operationId" ORDER BY "operationId") AS ops,
      (array_agg(fields ORDER BY "operationId") FILTER (WHERE fields IS NOT NULL))[1] AS fields
    FROM permission
    GROUP BY "roleId", "routeId"
  ) pp ON pp."roleId" = r.id
  WHERE r.archived = false
  GROUP BY r.id, r.name, r.description, r."colorId", r."colorName", r.active,
    r.archived, r."archivedAt", r."creatorName", r."updaterName", r."createdAt", r."updatedAt"
`;

/**
 * @typedef {Object} roleCache
 * @property {number} id - Role ID
 * @property {string} name - Role name
 * @property {Array<{ routeId: number, operationId: number, fields: string[]|null, _fieldsSet: Set<string>|null }>} permissions
 */

/** @type {Map<number, roleCache>} id → role */
let roles = new Map();

/**
 * Initializes the role cache by loading all non-archived role records from the ms-role service.
 * This function should be called once when the application starts to populate the
 * in-memory cache with role data including their permissions for fast lookups during
 * request processing and ACL validation.
 *
 * @example
 * // Initialize role cache at application startup
 * init();
 * console.log('Role cache initialized');
 */
function init() {
  return execute(ROLES_WITH_PERMISSIONS_QUERY, [], null).then((r) => {
    roles = new Map(
      r.rows.map((role) => [
        role.id,
        {
          ...role,
          permissions: role.permissions?.map((p) => ({
            ...p,
            _fieldsSet: p.fields?.length ? new Set(p.fields) : null,
          })) ?? [],
        },
      ])
    );
  });
}

/**
 * Retrieves a single role from the in-memory cache by its ID.
 *
 * @param {number} id - The unique identifier of the role to retrieve
 * @return {object|undefined} The role object if found, undefined if no role matches the given ID
 * @example
 * // Get a specific role
 * const role = getOne(1);
 * if (role) {
 *   console.log(`Found role: ${role.name}`);
 * }
 */
function getOne(id) {
  return roles.get(id);
}

function deleteArchived(date) {
  return execute('DELETE FROM role WHERE archived = true AND "archivedAt" < $1', [date], null)
    .then((r) => r.rowCount || 0);
}

export default {
  init,
  getOne,
  deleteArchived,
};
