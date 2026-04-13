// @ts-check
import corsSvc from "../services/cors.js";

const METHODS = "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH";
const HEADERS = "Content-Type, Authorization";

/**
 * CORS middleware for the gateway.
 * Validates incoming requests against a dynamic whitelist loaded from the database.
 * The whitelist is checked on each request to allow real-time updates through the admin.
 */
export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (origin) {
    if (!corsSvc.has(origin))
      return next({ statusCode: 403, message: `Origin ${origin} not allowed by CORS` });
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", METHODS);
  res.setHeader("Access-Control-Allow-Headers", HEADERS);
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  next();
}
