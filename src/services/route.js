// @ts-check

import { execute, filter } from "@dwtechs/antity-pgsql";
import route from "../entities/route.js";

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
  return execute(query, args, null).then((res) => {
    routes = res.rows;
  });
}

function getOne(requestUrl, requestMethod) {
  const actualUrl = stripTrailingSlash(requestUrl);
  return routes.find(
    (r) =>
      new RegExp(
        r.pattern.startsWith("~") ? r.pattern.slice(1) : r.pattern,
      ).test(actualUrl) && r.methods.includes(requestMethod),
  );
}

function stripTrailingSlash(url) {
  return url.replace(/\/$/, "");
}

export default {
  init,
  getOne,
};
