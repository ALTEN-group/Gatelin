// @ts-check
import cEnt from "../entities/consumer.js";
import { makeDeleteArchived } from "../utils/delete-archived.js";

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
 *
 * @return {Promise<void>} A promise that resolves when all consumers have been loaded into cache
 * @throws {Error} Database connection or query execution errors
 * @example
 * // Initialize consumer cache at application startup
 * await init();
 * console.log('Consumer cache initialized');
 */
function init() {
  return cEnt.getCache().then((rows) => {
    consumers = new Map(rows.map((c) => [c.accessToken, c]));
    consumerIdIndex = new Map(rows.map((c) => [c.id, c.accessToken]));
  });
}

/**
 * Retrieves a cached consumer record by access token.
 *
 * Pure cache accessor — a single `Map.get` keyed by access token (see `init()`
 * and `addToCache()` for how the Map is populated). No cryptographic
 * comparison, no side effects, no security decision on its own.
 *
 * NOT a full authentication check.
 * ---
 * `getOne` alone only proves "this access token exists in our cache" — a
 * WEAKER guarantee than "the caller presented matching access AND refresh
 * tokens." The full auth check is intentionally split across two middlewares
 * that MUST both run on any refresh-flow request:
 *
 *   1. `checkConsumer`     (src/middlewares/validators/check-consumer.js)
 *      Calls `getOne(accessToken)` and attaches the record to
 *      `res.locals.consumer`.
 *   2. `checkRefreshToken` (src/middlewares/validators/check-refreshToken.js)
 *      Reads `res.locals.consumer.refreshToken` (populated by step 1) and
 *      compares it against the request's refresh token via `timingSafeEqual`
 *      — constant-time to protect against timing attacks.
 *
 * The chain is wired in `src/routes/session.js`'s `update` array (getSession
 * → checkCsrf → checkRefreshToken → ...). Never use `getOne`'s return value
 * alone as an authorization decision — always chain it with
 * `checkRefreshToken` (or an equivalent crypto comparison) in the middleware
 * pipeline.
 *
 * @param {string} accessToken - The consumer's access token (used directly as
 *   the Map key; must be the exact string the record was cached under).
 * @return {ConsumerCache|undefined} The cached consumer record if found,
 *   otherwise `undefined`. Callers MUST NOT treat a truthy return as
 *   authenticated — see the "NOT a full authentication check" section above.
 * @example
 * const consumer = getOne('access-token-123');
 * if (consumer) log.debug(`Found consumer: ${consumer.nickname}`);
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

export default {
  init,
  getOne,
  addToCache,
  updateCache,
  deleteFromCache,
  deleteArchived: makeDeleteArchived(cEnt),
};
