// @ts-check
import corsSvc from "../services/cors.js";

const METHODS = "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH";
const HEADERS = "Content-Type, Authorization, X-CSRF-Token";

/**
 * CORS middleware for the gateway.
 * Validates incoming requests against a dynamic whitelist loaded from the database.
 * The whitelist is checked on each request to allow real-time updates through the admin.
 */
export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  // Allow-Origin is computed per request, so caches must key on Origin or they
  // will replay one origin's headers to another.
  res.setHeader("Vary", "Origin");

  if (origin) {
    if (!corsSvc.has(origin))
      return next({ statusCode: 403, message: "CORS policy violation" });
    res.setHeader("Access-Control-Allow-Origin", origin);
    if (corsSvc.getCredentials(origin))
      res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", METHODS);
  res.setHeader("Access-Control-Allow-Headers", HEADERS);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  next();
}
