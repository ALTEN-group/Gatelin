// @ts-check
import { CronJob } from "cron";
import { log } from "@dwtechs/winstan";
import consumerSvc from "../services/consumer.js";

/**
 * Cron job to delete archived consumers from the database.
 * Runs once daily at 2:00 AM.
 *
 * Cron schedule format: "second minute hour day month weekday"
 * Current schedule: "0 0 2 * * *" means every day at 2:00 AM
 *
 * @example
 * // Start the cron job
 * startDeleteArchivedConsumersJob();
 */
export function startDeleteArchivedConsumersJob() {
  // Schedule: Run every day at 2:00 AM
  new CronJob(
    "0 0 2 * * *", // cronTime: second, minute, hour, day, month, weekday
    async () => {
      try {
        log.info("Starting scheduled deletion of archived consumers...");
        const deletedCount = await consumerSvc.deleteArchived();
        log.info(`Successfully deleted ${deletedCount} archived consumer(s)`);
      } catch (error) {
        log.error(
          `Failed to delete archived consumers: ${error.message || error.msg}`,
        );
      }
    },
    null, // onComplete
    true, // start immediately
    "UTC", // timezone - Change this to your timezone if needed (e.g., "America/New_York")
  );

  log.info(
    "Delete archived consumers cron job initialized (runs daily at 2:00 AM UTC)",
  );
}
