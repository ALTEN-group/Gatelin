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
 * @property {number[]} roles - Array of role IDs
 */

/** @type {Map<string, ConsumerCache>} accessToken → consumer */
let consumers = new Map();

/** @type {Map<number, string>} id → accessToken */
let consumerIdIndex = new Map();

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
  const filters = {
    archived: {
      value: false,
      matchMode: "equals",
    },
  };
  const { query, args } = cEnt.query.select(0, 0, "id", "ASC", filters);
  return execute(query, args, null).then((r) => {
    consumers = new Map(r.rows.map((c) => [c.accessToken, c]));
    consumerIdIndex = new Map(r.rows.map((c) => [c.id, c.accessToken]));
  });
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
  return consumers.get(accessToken);
}

/**
 * Adds a consumer to the cache with the provided details.
 * Creates a copy of the consumer object to avoid reference issues.
 *
 * @param {ConsumerCache} consumer - The consumer object containing all relevant details.
 * @example
 * addToCache({ id: 1, userId: 123, nickname: 'user', accessToken: '...', refreshToken: '...', roles: [1, 2] });
 */
function addToCache(consumer) {
  consumers.set(consumer.accessToken, { ...consumer });
  consumerIdIndex.set(consumer.id, consumer.accessToken);
}

/**
 * Updates the cache for a specific consumer by updating their access and refresh tokens.
 *
 * @param {number|string} id - The ID of the consumer to update. Can be a number or a string.
 * @param {string} accessToken - The new access token for the consumer.
 * @param {string} refreshToken - The new refresh token for the consumer.
 * @param {number[]} roles - The updated array of role IDs for the consumer.
 * @return {boolean} True if the consumer was found and updated, false if no consumer with the given ID exists in the cache.
 * @throws {Error} If the provided ID is not a valid number or if there is an issue updating the cache.
 * @return {boolean} True if a consumer was found and updated, false otherwise
 */
function updateCache(id, accessToken, refreshToken, roles) {
  const numId = +id;
  const oldToken = consumerIdIndex.get(numId);
  if (!oldToken) return false;
  const c = consumers.get(oldToken);
  consumers.delete(oldToken);
  c.accessToken = accessToken;
  c.refreshToken = refreshToken;
  c.roles = roles;
  consumers.set(accessToken, c);
  consumerIdIndex.set(numId, accessToken);
  return true;
}

/**
 * Deletes a consumer from the cache by their ID.
 *
 * @param {string|number} id - The unique identifier of the consumer to be removed from the cache.
 */
function deleteFromCache(id) {
  const numId = +id;
  const token = consumerIdIndex.get(numId);
  if (!token) return;
  consumers.delete(token);
  consumerIdIndex.delete(numId);
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
  const q = cEnt.query.deleteArchive();
  return execute(q, [date], null).then((r) => r.rowCount || 0);
}

export default {
  init,
  getOne,
  addToCache,
  updateCache,
  deleteFromCache,
  deleteArchived,
};
