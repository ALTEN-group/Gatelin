// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import { log } from "@dwtechs/winstan";

/**
 * Fetches all history versions for a specific route from log.history table
 * Shows all INSERT and UPDATE operations for the route, ordered by timestamp
 *
 * @param {Object} req - Express request
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Route ID to get history for
 *
 * @param {Object} res - Express response
 * @param {Object} res.locals - Response locals object
 *
 * @param {Function} next - Express next middleware
 *
 * @modifies res.locals.history - Sets array of history records
 *
 * INPUT:
 *   req.params.id = route id (number)
 *
 * OUTPUT:
 *   res.locals.history = [{
 *     id: number,
 *     tstamp: timestamp,
 *     operation: string,
 *     consumerId: number,
 *     consumerName: string,
 *     record: object
 *   }]
 */
export function getRouteHistory(req, res, next) {
  const routeId = parseInt(req.params.id, 10);

  if (isNaN(routeId) || routeId < 1) {
    return next(new Error("Invalid route ID"));
  }

  const query = `
    SELECT 
      lh.id,
      lh.tstamp,
      lh.operation,
      lh."consumerId",
      lh."consumerName",
      lh.record
    FROM log.history lh
    WHERE lh."schemaName" = 'public'
      AND lh."tableName" = 'route'
      AND CAST(lh.record->>'id' AS INT) = $1
    ORDER BY lh.tstamp ASC
  `;

  execute(query, [routeId], null)
    .then((r) => {
      log.debug(`Found ${r.rows.length} history records for route ${routeId}`);
      res.locals.history = r.rows;
      next();
    })
    .catch((err) => next(err));
}
