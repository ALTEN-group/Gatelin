// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import cEnt from "../entities/consumer.js";

/**
 * @typedef {Object} ConsumerCache
 * @property {number} id - Consumer ID
 * @property {number} userId - User ID from ms_user service
 * @property {string} accessToken - JWT access token
 * @property {string} refreshToken - JWT refresh token
 * @property {string} nickname - Consumer nickname
 * @property {number[]} rolesArrayAgg - Array of role IDs
 */

/** @type {ConsumerCache[]} */
let consumers = [];


/**
 * Initializes the consumer cache by loading all consumer records from the database.
 * This function should be called once when the application starts to populate the
 * in-memory cache with consumer data for fast lookups during request processing.
 * Uses the @dwtechs/antity-pgsql library to build and execute the SQL query.
 *
 * @return {Promise<void>} A promise that resolves when all consumers have been loaded into cache
 * @throws {Error} Database connection or query execution errors
 * @example
 * // Initialize consumer cache at application startup
 * await init();
 * console.log('Consumer cache initialized');
 */
function init() {
  const { query, args } = cEnt.query.select(false, 0, 0, "id", null, null);
  return execute(query, args, null).then((r) => consumers = r.rows );
}


/**
 * Retrieves a single consumer from the in-memory cache by their access and refresh tokens.
 * This function searches through the cached consumers array to find a matching consumer
 * with both the provided access token and refresh token.
 *
 * @param {string} accessToken - The access token of the consumer to retrieve
 * @return {object|undefined} The consumer object if found, undefined if no consumer matches the given tokens
 * @example
 * // Get consumer with specific tokens
 * const consumer = getOne('access-token-123', 'refresh-token-456');
 * if (consumer) {
 *   console.log(`Found consumer: ${consumer.nickname}`);
 * }
 */
function getOne(accessToken) {
  return consumers.find((r) => r.accessToken === accessToken);
}

/**
 * Adds a consumer to the cache with the provided details.
 * Creates a copy of the consumer object to avoid reference issues.
 *
 * @param {ConsumerCache} consumer - The consumer object containing all relevant details.
 * @example
 * addToCache({ id: 1, userId: 123, nickname: 'user', accessToken: '...', refreshToken: '...', rolesArrayAgg: [1, 2] });
 */
function addToCache(consumer) {
  consumers.push({ ...consumer });
}

/**
 * Updates the cache for a specific consumer by updating their access and refresh tokens.
 *
 * @param {number|string} id - The ID of the consumer to update. Can be a number or a string.
 * @param {string} accessToken - The new access token for the consumer.
 * @param {string} refreshToken - The new refresh token for the consumer.
 * @return {boolean} True if a consumer was found and updated, false otherwise
 * @example
 * const updated = updateCache(1, 'new-access-token', 'new-refresh-token');
 * if (!updated) {
 *   console.log('Consumer not found in cache');
 * }
 */
function updateCache(id, accessToken, refreshToken) {
  let found = false;
  consumers = consumers.map((c) => {
    if (c.id === +id) {
      c.accessToken = accessToken;
      c.refreshToken = refreshToken;
      found = true;
    }
    return c;
  });
  return found;
}

/**
 * Deletes a consumer from the cache by their ID.
 *
 * @param {string|number} id - The unique identifier of the consumer to be removed from the cache.
 */
function deleteFromCache(id) {
  consumers = consumers.filter((r) => r.id !== +id);
}

export default {
  init,
  getOne,
  addToCache,
  updateCache,
  deleteFromCache,
};
