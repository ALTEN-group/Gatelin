// @ts-check
import { log } from "@dwtechs/winstan";
import { scheduleDailyAt } from "./scheduler.js";
import consumerSvc from "../services/consumer.js";
import serviceSvc from "../services/service.js";
import corsSvc from "../services/cors.js";
import operationSvc from "../services/operation.js";
import resourceSvc from "../services/resource.js";
import routeSvc from "../services/route.js";

/**
 * Cron job to delete archived entities from the database.
 * All entities must be archived for at least 2 months before deletion.
 * Runs once daily at 2:00 AM.
 *
 * Deletes archived records from: consumers, services, cors, operations, resources, and routes.
 *
 * Cron schedule format: "second minute hour day month weekday"
 * Current schedule: "0 0 2 * * *" means every day at 2:00 AM
 *
 * @example
 * // Start the cron job
 * startDeleteArchivedEntitiesJob();
 */
export function startDeleteArchivedEntitiesJob() {
  scheduleDailyAt(2, async () => {
      try {
        // Calculate date for 2 months ago
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        log.info(
          "Starting scheduled deletion of archived entities (archived > 2 months)...",
        );

        // Define all entities to process
        const entities = [
          { name: "consumers", service: consumerSvc },
          { name: "services", service: serviceSvc },
          { name: "CORS origins", service: corsSvc },
          { name: "operations", service: operationSvc },
          { name: "resources", service: resourceSvc },
          { name: "routes", service: routeSvc },
        ];

        let totalDeleted = 0;

        // Process each entity
        for (const entity of entities) {
          try {
            log.info(`  - Processing ${entity.name}...`);
            const deletedCount =
              await entity.service.deleteArchived(twoMonthsAgo);
            if (deletedCount > 0)
              log.info(`    ✓ Deleted ${deletedCount} archived ${entity.name}`);
            else log.info(`    • No archived ${entity.name} to delete`);

            totalDeleted += deletedCount;
          } catch (err) {
            log.error(
              `    ✗ Failed to delete archived ${entity.name}: ${err.message || err.msg}`,
            );
          }
        }

        log.info(
          `Completed deletion of archived entities. Total deleted: ${totalDeleted}`,
        );
      } catch (err) {
        log.error(
          `Failed to complete archived entities deletion job: ${err.message || err.msg}`,
        );
      }
    },
  });

  log.info("Delete archived entities job initialized (runs daily at 2:00 AM UTC, deletes entities archived > 2 months)");
}
