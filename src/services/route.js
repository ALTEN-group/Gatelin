// @ts-check

import { execute } from "@dwtechs/antity-pgsql";
import route from "../entities/route.js";
import { stripTrailingSlash } from "../utils/url.js";

/**
 * @typedef {Object} RouteConfig
 * @property {string} url - The URL pattern to match (prefix with ~ for regex)
 * @property {string[]} methods - Array of allowed HTTP methods
 */

/** @type {RouteConfig[]|null} */
let routes = null;

/**
 * Initializes the route cache by loading all route configurations from the database.
 * This function should be called once when the application starts to populate the
 * in-memory cache with route data for fast pattern matching during request processing.
 * Routes are used to determine which requests are valid and whether they require authentication.
 * Uses the @dwtechs/antity-pgsql library to build and execute the SQL query.
 *
 * @return {Promise<void>} A promise that resolves when all routes have been loaded into cache
 * @throws {Error} Database connection or query execution errors
 * @example
 * // Initialize route cache at application startup
 * await init();
 * console.log('Route cache initialized with', routes.length, 'routes');
 */
function init() {
  const { query, args } = route.query.select(false, 0, 0, "id", null, null);
  return execute(query, args, null).then((r) => (routes = r.rows));
}

/**
 * Finds a route configuration that matches the given URL and HTTP method.
 * Routes are matched using regex patterns - if a route pattern starts with '~',
 * it's treated as a regex pattern (with the '~' stripped), otherwise it's used as-is.
 * The URL is normalized by removing trailing slashes before matching.
 *
 * @param {string} requestUrl - The incoming request URL to match against route patterns
 * @param {string} requestMethod - The HTTP method (GET, POST, PUT, DELETE, etc.)
 * @return {RouteConfig|undefined} The matching route object with url, methods, and other config, or undefined if no match
 * @example
 * // Route with url: "~/api/users/[0-9]+" and methods: ["GET"]
 * getOne('/api/users/123', 'GET') // returns the matching route
 * getOne('/api/users/abc', 'GET') // returns undefined (no match)
 */
function getOne(requestUrl, requestMethod) {
  if (!routes) return undefined;
  // Normalize URL by removing trailing slash for consistent matching
  const actualUrl = stripTrailingSlash(requestUrl);
  // Find the first route that matches the URL and method
  return routes.find(
    (r) =>
      new RegExp(r.url).test(actualUrl) && r.methods.includes(requestMethod),
  );
}

/**
 * Deletes all archived routes from the database that have been archived for a specified duration.
 * This function is typically run by a scheduled job to clean up old/inactive route records.
 *
 * @param {Date} date - The date before which archived routes should be deleted.
 * @throws {Error} Database connection or query execution errors
 * @example
 * // Delete all routes archived for more than 2 months
 * const twoMonthsAgo = new Date();
 * twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
 * const deletedCount = await deleteArchived(twoMonthsAgo);
 * console.log(`Deleted ${deletedCount} archived route(s)`);
 */
function deleteArchived(date) {
  const { query, args } = route.query.deleteArchived(date);
  return execute(query, args, null).then((r) => r.rowCount || 0);
}

export default {
  init,
  getOne,
  deleteArchived,
};
