// @ts-check

import { execute } from "@dwtechs/antity-pgsql";
import cEnt from "../entities/cors.js";
import { makeDeleteArchived } from "../utils/delete-archived.js";

/** @type {Map<number, {name: string, credentials: boolean}>} id → origin data */
const corsOrigins = new Map();

/** @type {Map<string, boolean>} origin name → credentials flag for O(1) lookup */
const corsOriginNames = new Map();

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
 * console.log('CORS cache initialized with', corsOrigins.size, 'origins');
 */
function init() {
  const filters = {
    archived: {
      value: false,
      matchMode: "IS",
    },
  };
  const { query, args } = cEnt.query.select(0, 0, "id", "ASC", filters);
  return execute(query, args, null).then((r) => {
    corsOrigins.clear();
    corsOriginNames.clear();
    for (const row of r.rows) {
      corsOrigins.set(row.id, { name: row.name, credentials: row.credentials });
      corsOriginNames.set(row.name, row.credentials);
    }
  });
}

/**
 * Checks if an origin is in the CORS whitelist.
 *
 * @param {string} origin - The origin to check
 * @return {boolean} True if the origin is allowed
 * @example
 * if (!has('http://localhost:3000')) return next({ statusCode: 403 });
 */
function has(origin) {
  return corsOriginNames.has(origin);
}

/**
 * Returns whether an origin has credentials enabled.
 *
 * @param {string} origin - The origin to check
 * @return {boolean} True if the origin allows credentials
 */
function getCredentials(origin) {
  return corsOriginNames.get(origin) ?? false;
}

/**
 * Adds a CORS origin to the cache.
 *
 * @param {{ id: number, name: string }} corsOrigin - The CORS origin object to add
 * @example
 * addToCache({ id: 1, name: 'http://localhost:3000' });
 */
function addToCache(corsOrigin) {
  corsOrigins.set(corsOrigin.id, {
    name: corsOrigin.name,
    credentials: corsOrigin.credentials,
  });
  corsOriginNames.set(corsOrigin.name, corsOrigin.credentials);
}

/**
 * Updates a CORS origin in the cache.
 *
 * @param {number} id - The ID of the CORS origin to update
 * @param {string} name - The new origin name
 * @param {boolean} [credentials] - The new credentials flag; kept as-is when omitted
 * @return {boolean} True if updated, false if not found
 */
function updateCache(id, name, credentials) {
  const numId = +id;
  if (!corsOrigins.has(numId)) return false;
  const old = corsOrigins.get(numId);
  const creds = credentials === undefined ? old.credentials : credentials;
  corsOrigins.set(numId, { name, credentials: creds });
  corsOriginNames.delete(old.name);
  corsOriginNames.set(name, creds);
  return true;
}

/**
 * Deletes a CORS origin from the cache.
 *
 * @param {number} id - The ID of the CORS origin to delete
 */
function deleteFromCache(id) {
  const numId = +id;
  const entry = corsOrigins.get(numId);
  corsOrigins.delete(numId);
  if (entry) corsOriginNames.delete(entry.name);
}

export default {
  init,
  has,
  getCredentials,
  addToCache,
  updateCache,
  deleteFromCache,
  deleteArchived: makeDeleteArchived(cEnt),
};
