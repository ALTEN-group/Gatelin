// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import sEnt from "../entities/scope.js";

/**
 * @typedef {Object} ScopeCache
 * @property {number} id - Scope ID
 * @property {string} value - Scope keyword matched against URL path segments
 */

/** @type {ScopeCache[]} */
let scopes = [];

/**
 * Initializes the scope cache by loading all non-archived scope records from the database.
 *
 * @return {Promise<void>}
 */
function init() {
  const filters = {
    archived: {
      value: false,
      matchMode: "equals",
    },
  };
  const { query, args } = sEnt.query.select(0, 0, "id", "ASC", filters);
  return execute(query, args, null).then((r) => (scopes = r.rows));
}

/**
 * Resolves an array of scope IDs to their corresponding keyword values.
 *
 * @param {number[]} ids - Array of scope IDs from a permission
 * @return {string[]} Array of scope value strings
 */
function getValues(ids) {
  return scopes.filter((s) => ids.includes(s.id)).map((s) => s.value);
}

export default {
  init,
  getValues,
};
