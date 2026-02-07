// @ts-check
import http from "../services/http.js";

const { SERVER_SCHEME, PORT, APP_NAME, ENV_NAME } = process.env;
const san = `${SERVER_SCHEME}${APP_NAME}-`;
const ep = `-${ENV_NAME}:${PORT}`;
/**
 * Forwards incoming HTTP requests to appropriate microservices within the application cluster.
 * This controller handles the complete request forwarding lifecycle including URL construction,
 * header management, and response handling.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object  
 * @param {import('express').NextFunction} next - Express next function
 * @return {void} Sends response or passes error to next middleware
 * @throws {Error} Network errors or service unavailability
 * @example
 * // Use as Express route handler
 * import forwardToService from './controllers/proxy.js';
 * app.use('/', forwardToService);
 */
export function forwardToService(req, res, next) {
  const method = req.method; // GET, POST, etc.
  const serviceName = res.locals.route?.serviceName; // Target microservice name
  const route = req.url; // Request URL path
  const body = req.body; // Request body for POST/PUT requests

  // Construct internal service URL
  const serviceUrl = `${san}${serviceName}${ep}${route}`;
  
  // Forward request to target microservice
  http.query(method, serviceUrl, undefined, body, req.additionalHeaders)
    .then((r) => res.status(r.status).send(r.data))
    .catch((e) => next(e));
}
