// @ts-check
import { CronJob } from "cron";
import { log } from "@dwtechs/winstan";
import { deleteArchive } from "@dwtechs/antity-pgsql";

/**
 * Cron job to delete history records older than 6 months.
 * Runs once daily at 3:00 AM.
 *
 * Cron schedule format: "second minute hour day month weekday"
 * Current schedule: "0 0 3 * * *" means every day at 3:00 AM
 *
 * @example
 * // Start the cron job
 * startDeleteOldHistoryJob();
 */
export function startDeleteOldHistoryJob() {
  // Schedule: Run every day at 3:00 AM
  new CronJob(
    "0 0 3 * * *", // cronTime: second, minute, hour, day, month, weekday
    async () => {
      try {
        log.info("Starting scheduled deletion of old history records...");
        const deletedCount = await deleteOldHistory();
        log.info(`Successfully deleted ${deletedCount} old history record(s)`);
      } catch (err) {
        log.error(
          `Failed to delete old history records: ${err.message || err.msg}`,
        );
      }
    },
    null, // onComplete
    true, // start immediately
    "UTC", // timezone - Change this to your timezone if needed (e.g., "America/New_York")
  );

  log.info(
    "Delete old history records cron job initialized (runs daily at 3:00 AM UTC)",
  );
}

/**
 * Deletes history records older than 6 months from log.history table
 *
 * @returns {Promise<number>} Number of deleted records
 */
async function deleteOldHistory() {
  const result = await deleteArchive("log.history", "6 months");
  return result.rowCount || 0;
}
