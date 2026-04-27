// @ts-check
import { log } from "@dwtechs/winstan";

/**
 * Express middleware that deduplicates preference rows after GET.
 *
 * When a user has their own copy of a system default (same resource + name),
 * the GET returns both the system row (locked=true) and the user row (locked=false).
 * This middleware removes the system row so only the user copy is shown.
 *
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function deduplicatePreferences(_req, res, next) {
  const rows = res.locals.rows;
  if (!Array.isArray(rows) || rows.length === 0) return next();

  // Collect names of user-owned preferences (locked=false)
  const userNames = new Set(rows.filter((r) => !r.locked).map((r) => r.name));

  // Keep all user rows + system rows whose name has no user override
  const deduped = rows.filter((r) => !r.locked || !userNames.has(r.name));

  log.debug(
    () =>
      `deduplicatePreferences: ${rows.length} rows → ${deduped.length} after dedup`,
  );

  res.locals.rows = deduped;
  next();
}
