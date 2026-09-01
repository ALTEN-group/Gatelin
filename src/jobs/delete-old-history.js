// @ts-check

import { executeJob } from "./job-pool.js";
import { log } from "@dwtechs/winstan";
import { scheduleDailyAt } from "./scheduler.js";

const HISTORY_RETENTION_MONTHS = 6;

/**
 * Daily job to delete history records older than HISTORY_RETENTION_MONTHS.
 * Runs every day at 3:00 AM UTC.
 */
export function startDeleteOldHistoryJob() {
  scheduleDailyAt(
    3,
    async () => {
      log.info("Starting scheduled deletion of old history records...");
      const deletedCount = await deleteOldHistory();
      log.info(`Successfully deleted ${deletedCount} old history record(s)`);
    },
    "delete-old-history",
  );

  log.info(
    "Delete old history records job initialized (runs daily at 3:00 AM UTC)",
  );
}

/**
 * Deletes history records older than HISTORY_RETENTION_MONTHS from log.history table
 *
 * @returns {Promise<number>} Number of deleted records
 */
async function deleteOldHistory() {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - HISTORY_RETENTION_MONTHS);

  const query = "DELETE FROM log.history WHERE tstamp < $1";
  const args = [cutoff];
  return executeJob(query, args).then((r) => r.rowCount || 0);
}
