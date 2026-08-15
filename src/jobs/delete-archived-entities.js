// @ts-check
import { log } from "@dwtechs/winstan";
import applicationSvc from "../services/application.js";
import consumerSvc from "../services/consumer.js";
import corsSvc from "../services/cors.js";
import operationSvc from "../services/operation.js";
import resourceSvc from "../services/resource.js";
import roleSvc from "../services/role.js";
import routeSvc from "../services/route.js";
import scopeSvc from "../services/scope.js";
import serviceSvc from "../services/service.js";
import { scheduleDailyAt } from "./scheduler.js";

const ARCHIVE_RETENTION_MONTHS = 2;

/**
 * Cron job to delete archived entities from the database.
 * All entities must be archived for at least ARCHIVE_RETENTION_MONTHS before deletion.
 * Runs once daily at 2:00 AM.
 *
 * Deletes archived records from: consumers, services, CORS origins, operations, resources, routes, roles, applications, and scopes.
 *
 * Cron schedule format: "second minute hour day month weekday"
 * Current schedule: "0 0 2 * * *" means every day at 2:00 AM
 *
 * @example
 * // Start the cron job
 * startDeleteArchivedEntitiesJob();
 */
export function startDeleteArchivedEntitiesJob() {
  scheduleDailyAt(
    2,
    async () => {
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - ARCHIVE_RETENTION_MONTHS);

      log.info(
        `Starting scheduled deletion of archived entities (archived > ${ARCHIVE_RETENTION_MONTHS} months)...`,
      );

      // Define all entities to process
      const entities = [
        { name: "consumers", service: consumerSvc },
        { name: "services", service: serviceSvc },
        { name: "CORS origins", service: corsSvc },
        { name: "operations", service: operationSvc },
        { name: "resources", service: resourceSvc },
        { name: "routes", service: routeSvc },
        { name: "roles", service: roleSvc },
        { name: "applications", service: applicationSvc },
        { name: "scopes", service: scopeSvc },
      ];

      let totalDeleted = 0;

      // Process all entities concurrently
      const results = await Promise.allSettled(
        entities.map((entity) =>
          entity.service
            .deleteArchived(cutoff)
            .then((count) => ({ entity, count })),
        ),
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          const { entity, count } = result.value;
          if (count > 0)
            log.info(`    ✓ Deleted ${count} archived ${entity.name}`);
          else log.info(`    • No archived ${entity.name} to delete`);
          totalDeleted += count;
        } else {
          log.error(
            `    ✗ Failed: ${result.reason?.message || result.reason?.msg}`,
          );
        }
      }

      log.info(
        `Completed deletion of archived entities. Total deleted: ${totalDeleted}`,
      );
    },
    "delete-archived-entities",
  );

  log.info(
    `Delete archived entities job initialized (runs daily at 2:00 AM UTC, deletes entities archived > ${ARCHIVE_RETENTION_MONTHS} months)`,
  );
}
