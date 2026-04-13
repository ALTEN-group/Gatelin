// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import sEnt from "../entities/scope.js";

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
  const filters = {
    archived: {
      value: false,
      matchMode: "equals",
    },
  };
  const { query, args } = sEnt.query.select(0, 0, "id", "ASC", filters);
  return execute(query, args, null).then((r) => {
    scopes = new Map(r.rows.map((s) => [s.id, s.name]));
  });
}

/**
 * Resolves an array of scope IDs to their corresponding keyword values.
 *
 * @param {number[]} ids - Array of scope IDs from a permission
 * @return {string[]} Array of scope value strings
 */
function getValues(ids) {
  return ids.map((id) => scopes.get(id)).filter(Boolean);
}

export default {
  init,
  getValues,
};
