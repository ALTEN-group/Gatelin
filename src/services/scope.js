// @ts-check
import sEnt from "../entities/scope.js";
import { makeDeleteArchived } from "../utils/delete-archived.js";

/**
 * @typedef {Object} ScopeCache
 * @property {number} id - Scope ID
 * @property {string} value - Scope keyword matched against URL path segments
 */

/** @type {Map<number, string>} id → scope name */
let scopes = new Map();

/**
 * Initializes the scope cache by loading all non-archived scope records from the database.
 *
 * @return {Promise<void>}
 */
function init() {
  return sEnt.getCache().then((rows) => {
    scopes = new Map(rows.map((s) => [s.id, s.name]));
  });
}

/**
 * Returns the scope names for an array of scope IDs.
 * Used for URL path segment matching in ACL checks.
 *
 * @param {number[]} ids - Array of scope IDs from a permission
 * @return {string[]} Array of scope name strings
 */
function getValues(ids) {
  return ids.reduce((acc, id) => {
    const name = scopes.get(id);
    if (name) acc.push(name);
    return acc;
  }, []);
}

export default {
  init,
  getValues,
  deleteArchived: makeDeleteArchived(sEnt),
};
