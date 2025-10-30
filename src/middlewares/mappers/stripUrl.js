import { log } from "@dwtechs/winstan";

/**
 * Express middleware that strips route patterns from the original URL to prepare it for microservice forwarding.
 * This is essential for gateway routing where the gateway route pattern needs to be removed before 
 * sending the request to the target microservice.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object  
 * @param {import('express').NextFunction} next - Express next function
 * @param {string} req.originalUrl - The original request URL with gateway route pattern
 * @param {object} req.route - Route object added by checkRoute middleware  
 * @param {string} req.route.pattern - The route pattern to strip (can be regex if starts with ~)
 * 
 * @example
 * // Gateway route pattern: "~^/api/users"
 * // Original URL: "/api/users/123/profile"
 * // After stripping: "/123/profile"
 * 
 * @example
 * // Gateway route pattern: "/api/auth" (non-regex)
 * // Original URL: "/api/auth/login" 
 * // After stripping: "/api/auth/login" (no change for non-regex patterns)
 */
export default function stripUrl(req, res, next) {
  const u = req.originalUrl;
  const p = req.route.pattern;
  log.debug(`stripUrl(originalUrl=${u}, pattern=${p})`);
  req.url = p && u ? strip(p, u) : u;
  log.debug(`stripped Url : ${req.url}`);
  next();
}

/**
 * Helper function that performs the actual URL stripping based on pattern type.
 * 
 * @param {string} pattern - The route pattern to strip from the URL
 * @param {string} url - The original URL to process
 * @returns {string} The URL with the pattern stripped (if pattern is regex) or original URL
 * 
 */
function strip(pattern, url) {
  return pattern.startsWith("~")
    ? url.replace(new RegExp(pattern.slice(1)), "")
    : url;
}

