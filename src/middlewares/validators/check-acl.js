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

function findMatchingPermission(roles, routeId, routeOperations, scopeSegment) {
  for (const id of roles) {
    const role = roleService.getOne(id);
    if (!role) continue;

    const perm = role.permissions.find(
      (p) =>
        p.route === routeId &&
        p.operations.some((op) => routeOperations.includes(op)),
    );
    if (!perm) continue;
    if (perm.scopes) {
      const scopeValues = scopeService.getValues(perm.scopes);
      if (!scopeValues.includes(scopeSegment)) continue;
    }
    return perm;
  }
  return null;
}

export default function checkAcl(req, res, next) {
  const r = res.locals.route;
  if (!r.isProtected) return next(); // if no jwt required for this route

  const c = res.locals.consumer;
  log.debug(
    () =>
      `checkAcl(consumer: ${c.id}, operations: ${r.operations}, route: ${r.url}`,
  );

  const urlSegments = req.originalUrl.split("?")[0].split("/").filter(Boolean);
  const resourceIndex = urlSegments.indexOf(r.resourceName);
  const scopeSegment =
    resourceIndex !== -1 ? (urlSegments[resourceIndex + 1] ?? null) : null;
  const perm = findMatchingPermission(
    c.roles,
    r.id,
    r.operations,
    scopeSegment,
  );
  if (!perm) return next({ statusCode: 403, message: "Forbidden" });

  const fields = perm.fields;

  // Filter request body fields on write operations
  if (fields?.length && req.body) {
    const allowed = new Set(fields);
    const rows = req.body.rows;
    if (isArray(rows))
      req.body.rows = rows.map((item) => filterFields(item, allowed));
    else if (!isProperty(req.body, "rows"))
      req.body = filterFields(req.body, allowed);
  }

  // Store field allowlist for request body filtering
  res.locals.aclFields = fields;

  next();
}
