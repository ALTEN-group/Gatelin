// @ts-check
import { execute, filter } from "@dwtechs/antity-pgsql";
import { log } from "@dwtechs/winstan";
import consumer from "../entities/consumer.js";

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
  const { query, args } = consumer.query.select(false, 0, 0, "id", null, null);
  return execute(query, args, null).then((res) => {
    consumers = res.rows;
  });
}


/**
 * Retrieves a single consumer from the in-memory cache by their unique identifier.
 * This function searches through the cached consumers array to find a matching consumer ID.
 *
 * @param {number|string} consumerId - The unique identifier of the consumer to retrieve
 * @return {object|undefined} The consumer object if found, undefined if no consumer matches the given ID
 * @example
 * // Get consumer with ID 123
 * const consumer = getOne(123);
 * if (consumer) {
 *   console.log(`Found consumer: ${consumer.nickname}`);
 * }
 */
function getOne(consumerId) {
  return consumers.find((r) => r.id === +consumerId);
}

// function addOne(id, nickname, accessToken, refreshToken, maxLevel, roles) {
//   const args = [
//     id,
//     nickname,
//     accessToken,
//     refreshToken,
//     maxLevel,
//     `{${roles.toString()}}`,
//   ];
//   // const query = pg.generateQueryPlaceholders(6);
//   return consumer
//     .insert(args, "id", null)
//     .then(() =>
//       addCache(id, nickname, accessToken, refreshToken, maxLevel, roles),
//     );
// }

// function updateOne(id, accessToken, refreshToken) {
//   // const cols = consumer.getCols("update", true);
//   // const query = [`${cols} WHERE id = $${cols.length + 1}`];
//   const args = [accessToken, refreshToken];
//   const filters = { id: { value: id } };
//   return consumer
//     .update(filters, args, null)
//     .then(() => updateCache(id, accessToken, refreshToken));
// }

/**
 * Deletes a single consumer from the database based on the provided id.
 * As a result it will log him out and remove it from the cache
 *
 * @param {number} consumerId - The consumer id to delete
 * @return {Promise<void>}
 */
// function deleteOne(consumerId) {
//   return consumer
//     .deleteOne(consumerId)
//     .then(() => deleteCache(consumerId));
// }

/**
 * Adds a consumer to the cache with the provided details.
 *
 * @param {object} consumer - The consumer object containing all relevant details.
 */
function addCache(consumer) {
  consumers.push(consumer);
}

/**
 * Updates the cache for a specific consumer by updating their access and refresh tokens.
 *
 * @param {number|string} id - The ID of the consumer to update. Can be a number or a string.
 * @param {string} accessToken - The new access token for the consumer.
 * @param {string} refreshToken - The new refresh token for the consumer.
 */
function updateCache(id, accessToken, refreshToken) {
  consumers = consumers.map((c) => {
    if (c.id === +id) {
      c.accessToken = accessToken;
      c.refreshToken = refreshToken;
      log.debug(`consumer ${id} cache updated`);
    }
    return c;
  });
}

/**
 * Deletes a consumer from the cache by their ID.
 *
 * @param {string|number} consumerId - The unique identifier of the consumer to be removed from the cache.
 */
function deleteCache(consumerId) {
  consumers = consumers.filter((r) => r.id !== consumerId);
}


export default {
  init,
  getOne,
  addCache,
  updateCache,
  deleteCache,
};
