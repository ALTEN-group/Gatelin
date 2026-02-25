// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import sEnt from "../entities/service.js";

/**
 * Deletes all archived services from the database that have been archived for a specified duration.
 * This function is typically run by a scheduled job to clean up old/inactive service records.
 *
 * @param {Date} date - The date before which archived services should be deleted.
 * @param {number} months - Number of months a service must be archived before deletion (default: 2).
 * @throws {Error} Database connection or query execution errors
 * @example
 * // Delete all services archived for more than 2 months
 * const twoMonthsAgo = new Date();
 * twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
 * const deletedCount = await deleteArchived(twoMonthsAgo);
 * console.log(`Deleted ${deletedCount} archived service(s)`);
 */
function deleteArchived(date) {
  const { query, args } = sEnt.query.deleteArchived(date);
  return execute(query, args, null).then((r) => r.rowCount || 0);
}

export default {
  deleteArchived,
};
