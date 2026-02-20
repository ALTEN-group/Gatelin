// @ts-check
import { log } from "@dwtechs/winstan";

import routeSvc from "../../services/route.js";

/**
 * @typedef {object} Route
 * @property {number} id - The unique identifier of the route
 * @property {string} url - The URL pattern of the route
 * @property {string} method - The HTTP method (GET, POST, etc.)
 * @property {boolean} jwt - Whether the route requires JWT authentication
 * @property {string} description - Description of the route
 * @property {object} [config] - Additional route configuration
 */

/**
 * Express middleware that validates incoming HTTP requests by checking if the requested
 * route exists in the system and determining its protection level. This middleware
 * enriches the request object with route information and protection status for
 * downstream middleware to use.
 *
 * @param {import('express').Request} req - Express request object containing the HTTP request data
 * @param {import('express').Response} res - Express response object for sending HTTP responses
 * @param {import('express').NextFunction} next - Express next function to pass control to the next middleware
 * @return {void} Calls next() to continue middleware chain or next(error) on route not found
 * @throws {object} Returns 404 error object if no matching route is found
 * @example
 * // Use as Express middleware
 * import checkRoute from './middlewares/validators/check-route.js';
 * app.use('/api', checkRoute);
 *
 * // After successful validation, req object will have:
 * // res.locals.route.isProtected - boolean indicating if route requires JWT authentication
 * // res.locals.route.serviceName - name of the service handling the route
 */
export default function checkRoute(req, res, next) {
  const u = req.originalUrl;
  const m = req.method;
  log.debug(`checkRoute(url: ${u}, method: ${m})`);

  const r = routeSvc.getOne(u, m);
  if (!r) return next({ statusCode: 404, message: "Route not found" });

  log.debug(`checkRoute(Route: ${JSON.stringify(r)})`);

  // Add custom properties to locals object for downstream middleware
  res.locals.route = r;

  next();
}
