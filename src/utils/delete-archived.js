// @ts-check
import { executeJob } from "../jobs/job-pool.js";

/**
 * Creates a deleteArchived function bound to a physical table name.
 * Runs as the job DB role via `delete()`, which the app role cannot EXECUTE.
 * Pass the base table (`route`, `role`, …), not the writable view (`routes`, `roles`).
 *
 * @param {string} table
 * @returns {(date: Date) => Promise<number>} deleted row count
 */
export function makeDeleteArchived(table) {
  return function deleteArchived(date) {
    return executeJob("SELECT delete($1, $2, $3) AS count", [
      "public",
      table,
      date,
    ]).then((r) => Number(r.rows?.[0]?.count ?? 0));
  };
}
