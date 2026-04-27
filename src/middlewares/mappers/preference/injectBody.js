// @ts-check
import { log } from "@dwtechs/winstan";

/**
 * Express middleware that injects userId (from the JWT session) and resource
 * (from the URL param) into each row of req.body.rows sent by the front-end.
 *
 * @param {import('express').Request} req
 * @param {Object} req.body
 * @param {Array<object>} req.body.rows - Rows from the client
 * @param {Object} req.params
 * @param {string} req.params.resource - Table/component identifier from URL
 * @param {import('express').Response} res
 * @param {number} res.locals.consumer.userId - Authenticated user ID
 * @param {import('express').NextFunction} next
 */
export function injectBody(req, res, next) {
  if (!req.body) req.body = {};

  const userId = res.locals.consumer.userId;
  const { resource } = req.params;
  log.debug(
    () => `injectPreferenceBody(userId=${userId}, resource=${resource})`,
  );

  const rows = Array.isArray(req.body.rows) ? req.body.rows : [];

  if (rows.length === 0) {
    log.debug(() => `injectPreferenceBody: empty rows, skipping`);
    return res.json({
      rows: [],
      sync: { inserted: 0, updated: 0, deleted: 0 },
    });
  }

  // Include all rows (locked or not).
  // - locked=true rows are system defaults: antity-pgsql ignores the 'locked' and 'id'
  //   fields during INSERT (they are SELECT-only), so they will be created as user-owned
  //   copies with the DB default locked=false.
  // - locked=false rows are existing user preferences: they will be updated.
  // The upsert conflict target (userId, resource, name) handles both cases safely.
  req.body.rows = rows.map((row) => ({
    ...row,
    userId,
    resource,
  }));

  // Use upsert conflict resolution: INSERT the row if (userId, resource, name) doesn't
  // exist yet, otherwise UPDATE it. This avoids the duplicate key error that sync caused
  // when frontend sent back system default rows with IDs not in the user's scope.
  req.body.conflictTarget = ["userId", "resource", "name"];

  next();
}
