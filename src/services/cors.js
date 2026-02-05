// @ts-check

import { execute } from "@dwtechs/antity-pgsql";
import cEnt from "../entities/cors.js";

/**
 * @typedef {Object} CorsConfig
 * @property {number} id - CORS configuration ID
 * @property {string} name - Allowed origin (URL)
 */

/** @type {CorsConfig[]|null} */
let corsOrigins = null;

/**
 * Initializes the CORS cache by loading all allowed origins from the database.
 * This function should be called once when the application starts to populate the
 * in-memory cache with CORS origins for request validation.
 * Uses the @dwtechs/antity-pgsql library to build and execute the SQL query.
 *
 * @return {Promise<void>} A promise that resolves when all CORS origins have been loaded into cache
 * @throws {Error} Database connection or query execution errors
 * @example
 * // Initialize CORS cache at application startup
 * await init();
 * console.log('CORS cache initialized with', corsOrigins.length, 'origins');
 */
function init() {
  const { query, args } = cEnt.query.select(false, 0, 0, "id", null, null);
  return execute(query, args, null).then((r) => corsOrigins = r.rows );
}

/**
 * Returns all cached CORS origins as an array of origin strings.
 * Used to populate CORS whitelist.
 *
 * @return {string[]} Array of allowed origin URLs
 * @example
 * const whitelist = getAll();
 * // ['http://localhost:3000', 'https://example.com']
 */
function getAll() {
  if (!corsOrigins) return [];
  return corsOrigins.map(c => c.name);
}

/**
 * Adds a CORS origin to the cache.
 *
 * @param {CorsConfig} corsOrigin - The CORS origin object to add
 * @example
 * addToCache({ id: 1, name: 'http://localhost:3000' });
 */
function addToCache(corsOrigin) {
  if (!corsOrigins) corsOrigins = [];
  corsOrigins.push({ ...corsOrigin });
}

/**
 * Updates a CORS origin in the cache.
 *
 * @param {number} id - The ID of the CORS origin to update
 * @param {string} name - The new origin name
 * @return {boolean} True if updated, false if not found
 */
function updateCache(id, name) {
  if (!corsOrigins) return false;
  let found = false;
  corsOrigins = corsOrigins.map((c) => {
    if (c.id === +id) {
      c.name = name;
      found = true;
    }
    return c;
  });
  return found;
}

/**
 * Deletes a CORS origin from the cache.
 *
 * @param {number} id - The ID of the CORS origin to delete
 */
function deleteFromCache(id) {
  if (!corsOrigins) return;
  corsOrigins = corsOrigins.filter((c) => c.id !== +id);
}

export default {
  init,
  getAll,
  addToCache,
  updateCache,
  deleteFromCache,
};
