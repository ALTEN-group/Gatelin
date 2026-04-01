// @ts-check
import { log } from "@dwtechs/winstan";
import { execute } from "@dwtechs/antity-pgsql";
import { scheduleDailyAt } from "./scheduler.js";

/**
 * Daily job to delete history records older than 6 months.
 * Runs every day at 3:00 AM UTC.
 */
export function startDeleteOldHistoryJob() {
  scheduleDailyAt(3, async () => {
    try {
      log.info("Starting scheduled deletion of old history records...");
      const deletedCount = await deleteOldHistory();
      log.info(`Successfully deleted ${deletedCount} old history record(s)`);
    } catch (err) {
      log.error(`Failed to delete old history records: ${err.message || err.msg}`);
    }
  });

  log.info("Delete old history records job initialized (runs daily at 3:00 AM UTC)");
}

/**
 * Deletes history records older than 6 months from log.history table
 *
 * @returns {Promise<number>} Number of deleted records
 */
async function deleteOldHistory() {
  // Calculate date for 6 months ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const query = "DELETE FROM log.history WHERE created < $1";
  const args = [sixMonthsAgo];
  return execute(query, args, null).then((r) => r.rowCount || 0);
}
