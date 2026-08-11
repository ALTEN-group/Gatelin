// @ts-check
import http from "../utils/http.js";
import routeSvc from "../services/route.js";
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
  const serviceName = res.locals.route.serviceName;
  const body = req.body;

  // Normalize the URL to resolve any path traversal sequences before forwarding
  const parsed = new URL(req.url, "http://placeholder");
  const safeRoute = `${parsed.pathname}${parsed.search}`;

  // Look up pre-built base URL for this service
  const url = `${routeSvc.getServiceBaseUrl(serviceName)}${safeRoute}`;

  // Forward request to target microservice.
  //
  // Error status propagation: http.js populates `err.statusCode` on both the
  // upstream-non-2xx path (real HTTP code, e.g. 401 for a bad token, 404 for
  // a missing resource) and the network-error path (503 default for
  // ECONNREFUSED / DNS / TLS failures). Preserve that upstream status so the
  // client sees the true cause, not a blanket "Bad Gateway" for everything.
  // 502 remains the last-resort default when the error object carries no
  // recognizable status (should be unreachable given http.js's contract, but
  // fail-safe if it ever throws a raw exception from a code path we don't
  // control — e.g. a synchronous crash before the fetch call).
  http
    .query(method, url, undefined, body, req.additionalHeaders)
    .then((r) => res.status(r.status).send(r.data))
    .catch((e) =>
      next({ statusCode: e.statusCode || e.status || 502, message: e.message }),
    );
}
