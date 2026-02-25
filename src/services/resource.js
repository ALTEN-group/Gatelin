// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import rEnt from "../entities/resource.js";

/**
 * Deletes all archived resources from the database that have been archived for a specified duration.
 * This function is typically run by a scheduled job to clean up old/inactive resource records.
 *
 * @param {Date} date - The date before which archived resources should be deleted.
 * @throws {Error} Database connection or query execution errors
 * @example
 * // Delete all resources archived for more than 2 months
 * const twoMonthsAgo = new Date();
 * twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
 * const deletedCount = await deleteArchived(twoMonthsAgo);
 * console.log(`Deleted ${deletedCount} archived resource(s)`);
 */
function deleteArchived(date) {
  const { query, args } = rEnt.query.deleteArchived(date);
  return execute(query, args, null).then((r) => r.rowCount || 0);
}

export default {
  deleteArchived,
};
