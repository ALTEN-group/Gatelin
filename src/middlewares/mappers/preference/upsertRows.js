// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import { log } from "@dwtechs/winstan";
import pEnt from "../../../entities/preference.js";

/**
 * Express middleware that handles mixed insert/update operations.
 * Separates rows with IDs (to update) from rows without IDs (to insert),
 * builds queries using the entity's query builder, and executes them.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function upsertRows(req, res, next) {
  const rows = req.body.rows || [];

  // Separate rows into inserts and updates in a single pass
  const rowsToInsert = [];
  const rowsToUpdate = [];
  for (const row of rows) {
    (row.id ? rowsToUpdate : rowsToInsert).push(row);
  }

  log.debug(
    () =>
      `upsertRows: ${rowsToInsert.length} inserts, ${rowsToUpdate.length} updates`,
  );

  const results = [];

  // Handle inserts
  if (rowsToInsert.length > 0) {
    const { query, args } = pEnt.query.insertArray(rowsToInsert);
    const result = await execute(query, args, null);
    if (result.rows) {
      results.push(...result.rows);
    }
  }

  // Handle updates
  if (rowsToUpdate.length > 0) {
    const { query, args } = pEnt.query.updateArray(rowsToUpdate);
    const result = await execute(query, args, null);
    if (result.rows) {
      results.push(...result.rows);
    }
  }

  // Store results
  res.locals.rows = results;
  res.locals.total = results.length;

  next();
}
