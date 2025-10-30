// @ts-check
import http from "httpclient";

const { SERVER_SCHEME, PORT, APP_NAME, ENV_NAME } = process.env;

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
export default function forwardToService(req, res, next) {
  const method = req.method;
  // @ts-ignore - Custom property added by header middleware
  const headers = req.additionalHeaders || {};
  // @ts-ignore - Custom property added by route middleware
  const serviceName = req.route.serviceName;
  const route = req.url;
  const body = req.body;

  // Construct internal service URL
  const serviceUrl = `${SERVER_SCHEME}${APP_NAME}-${serviceName}-${ENV_NAME}:${PORT}${route}`;
  
  // Forward request to target microservice
  http.query(method, serviceUrl, null, body, headers)
    .then((r) => res.status(r.status).send(r.data))
    .catch((e) => next(e));
}
