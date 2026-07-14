// @ts-check
import { log } from "@dwtechs/winstan";
import { confEquals } from "../../../utils/preferenceConf.js";

/**
 * Express middleware that deduplicates preference rows after GET.
 *
 * When a user has their own copy of a system default (same resource + name),
 * the GET returns both the system row (locked=true) and the user row (locked=false).
 * This middleware removes the system row so only the user copy is shown.
 *
 * A user-owned row can exist purely because the user activated it (toggling
 * `isActive` requires a personal row) without ever customizing its `conf`.
 * In that case the row is still re-flagged as `locked: true` in the response,
 * so the front-end keeps treating it as a protected system preset instead of
 * an editable/deletable custom one — only a genuine `conf` change (a real
 * customization) should ever "unlock" it.
 *
 * A structural fork (see injectBody.js) creates a personal row under a NEW
 * name, keeping whatever `isActive` the source view had - without ever
 * touching the locked original's own `isActive` (shared across all users).
 * That can leave two rows both reporting `isActive: true` for the same
 * resource. Only one row may ever be reported active: the user's own pick
 * always wins over the locked default.
 *
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function deduplicatePreferences(_req, res, next) {
  const rows = res.locals.rows;
  if (!Array.isArray(rows) || rows.length === 0) return next();

  const lockedByName = new Map(
    rows.filter((r) => r.locked).map((r) => [r.name, r]),
  );

  // Collect names of user-owned preferences (locked=false)
  const userNames = new Set(rows.filter((r) => !r.locked).map((r) => r.name));

  // Keep all user rows + system rows whose name has no user override
  const deduped = rows
    .filter((r) => !r.locked || !userNames.has(r.name))
    .map((r) => {
      if (r.locked) return r;
      const def = lockedByName.get(r.name);
      return def && confEquals(def.conf, r.conf) ? { ...r, locked: true } : r;
    });

  // A structural fork keeps whatever `isActive` the resized/customized view
  // already had, without ever touching the locked original's own `isActive`
  // (it's shared, userId=-1, and must stay untouched for other users). That
  // can leave two rows both reporting isActive=true for the same resource.
  // The user's own pick always wins over the locked default.
  const activeUserRow = deduped.find((r) => !r.locked && r.isActive);
  const withSingleActive = activeUserRow
    ? deduped.map((r) => (r === activeUserRow ? r : { ...r, isActive: false }))
    : deduped;

  log.debug(
    () =>
      `deduplicatePreferences: ${rows.length} rows → ${withSingleActive.length} after dedup`,
  );

  res.locals.rows = withSingleActive;
  next();
}
