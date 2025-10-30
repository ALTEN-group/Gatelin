import { getCommonValues } from "@dwtechs/sparray";
import { log } from "@dwtechs/winstan";

import accessSvc from "../../services/access.js";

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
export default function checkAcl(req, res, next) {
  if (!req.isProtected) return next(); // if no jwt required for this route

  if (!res.rows) return next({ statusCode: 404, message: "User not found" });
  
  const consumer = res.rows[0];
  if (!consumer)
    return next({ statusCode: 404, message: "User not found" });
  
  const routeId = req.route.id;
  const consumerRoles = consumer.roles;
  const accessRoles = accessSvc.getOne(routeId)?.rolesArrayAgg;
  log.debug(
    `checkAcl(routeId=${routeId}, consumerRoles=[${consumerRoles?.toString()}], accessRoles=[${accessRoles?.toString()}])`,
  );

  if (accessRoles) {
    const commonRoles = getCommonValues(consumerRoles, accessRoles);
    if (!commonRoles.length)
      return next({ statusCode: 403, message: "Forbidden" });
  }
  next();
}


