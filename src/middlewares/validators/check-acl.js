import { log } from "@dwtechs/winstan";
import { isArray, isProperty } from "@dwtechs/checkard";
import roleService from "../../services/role.js";
import scopeService from "../../services/scope.js";

/**
 * Express middleware that validates user access control permissions for protected routes.
 * Checks if the authenticated user has the required roles to access the requested route.
 *
 * @param {import('express').Request} req - Express request object containing the HTTP request data
 * @param {Object} req.isProtected - Flag indicating if route requires authentication
 * @param {Object} req.route - Route information object
 * @param {number} req.route.id - Unique identifier for the route
 * @param {import('express').Response} res - Express response object for sending HTTP responses
 * @param {Array} res.rows - Array containing user data from previous middleware
 * @param {Object} res.rows[0] - User/consumer object
 * @param {Array<string>} res.rows[0].roles - Array of roles assigned to the user
 * @param {import('express').NextFunction} next - Express next function to pass control to the next middleware
 * @throws {Object} 404 error when user is not found in res.rows
 * @throws {Object} 403 error when user lacks required roles for the route
 * @example
 * // Used as Express middleware in route definitions
 * app.get('/protected-route', authenticateJWT, checkAcl, (req, res) => {
 *   res.json({ message: 'Access granted' });
 * });
 *
 * // Route configuration with roles
 * // Route ID 123 requires 'admin' or 'moderator' roles
 * // User with roles ['user', 'admin'] would pass
 * // User with roles ['user'] would get 403 Forbidden
 */
function filterFields(item, allowed) {
  return Object.fromEntries(
    Object.entries(item).filter(([k]) => allowed.has(k)),
  );
}

function findMatchingPermission(
  roles,
  routeId,
  routeOperations,
  req,
  resourceName,
) {
  for (const id of roles) {
    const role = roleService.getOne(id);
    if (!role) continue;

    // O(1) lookup by routeId instead of array scan
    const perm = role.permissions.get(routeId);
    if (!perm) continue;
    if (!perm.operations.some((op) => routeOperations.includes(op))) continue;

    let conditions = null;
    if (isArray(perm.scopes, "!0")) {
      const urlScopes = scopeService.getValues(perm.scopes);
      if (isArray(urlScopes, "!0")) {
        // Only parse URL segments when this permission actually uses URL scopes
        const urlSegments = req.originalUrl
          .split("?")[0]
          .split("/")
          .filter(Boolean);
        const resourceIndex = urlSegments.indexOf(resourceName);
        const scopeSegment =
          resourceIndex !== -1
            ? (urlSegments[resourceIndex + 1] ?? null)
            : null;
        if (!urlScopes.includes(scopeSegment)) continue;
      }
    }
    if (isArray(perm.conditions, "!0")) {
      conditions = perm.conditions;
    }
    return { perm, conditions };
  }
  return null;
}

export default function checkAcl(req, res, next) {
  const r = res.locals.route;
  if (!r.protected) return next(); // if no jwt required for this route

  const c = res.locals.consumer;
  log.debug(
    () =>
      `checkAcl(consumer: ${c.id}, operations: ${r.operationId}, route: ${r.url}`,
  );

  // Extract URL path segments (strip query string first), then find the position
  // of the resource name (e.g. "preferences") to identify the scope segment that
  // follows it in the URL (e.g. /preferences/session → scopeSegment = "session").
  // scopeSegment is used to match scope-restricted permissions (perm.scopes).
  const result = findMatchingPermission(
    c.roles,
    r.id,
    r.operationId,
    req,
    r.resourceName,
  );
  if (!result) return next({ statusCode: 403, message: "Forbidden" });

  const { perm, conditions } = result;
  if (conditions) req.aclConditions = conditions;

  const allowed = perm._fieldsSet;

  // Filter request body fields on write operations
  if (allowed && req.body) {
    const rows = req.body.rows;
    if (isArray(rows))
      req.body.rows = rows.map((item) => filterFields(item, allowed));
    else if (!isProperty(req.body, "rows"))
      req.body = filterFields(req.body, allowed);
  }

  // Store field allowlist for request body filtering
  res.locals.aclFields = perm.fields;

  next();
}
