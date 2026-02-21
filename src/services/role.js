// @ts-check
import http from "../utils/http.js";

const { MSROLE_URL } = process.env;
const url = `${MSROLE_URL}/roles/roles/search/`;

/**
 * @typedef {Object} roleCache
 * @property {number} id - Role ID
 * @property {string} name - Role name
 * @property {Array<{ route: number, operations: number[] }>} permissions - Array of permissions for the role
 */

/** @type {roleCache[]} */
let roles = [];

/**
 * Initializes the role cache by loading all non-archived role records from the ms-role service.
 * This function should be called once when the application starts to populate the
 * in-memory cache with role data including their permissions for fast lookups during
 * request processing and ACL validation.
 *
 * @example
 * // Initialize role cache at application startup
 * init();
 * console.log('Role cache initialized');
 */
function init() {
  const filters = {
    archived: {
      value: false,
      matchMode: "is",
    },
  };
  http
    .query("POST", url, undefined, { filters }, undefined)
    .then((r) => (roles = r.data.rows));
}

/**
 * Retrieves a single role from the in-memory cache by its ID.
 *
 * @param {number} id - The unique identifier of the role to retrieve
 * @return {object|undefined} The role object if found, undefined if no role matches the given ID
 * @example
 * // Get a specific role
 * const role = getOne(1);
 * if (role) {
 *   console.log(`Found role: ${role.name}`);
 * }
 */
function getOne(id) {
  return roles.find((r) => r.id === id);
}

export default {
  init,
  getOne,
};
