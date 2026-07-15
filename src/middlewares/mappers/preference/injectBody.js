// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import { log } from "@dwtechs/winstan";
import { confEquals } from "../../../utils/preferenceConf.js";

/**
 * Builds a unique "<name> (copy[ N])" name to fork a locked preference into
 * a personal, distinctly-named view, avoiding collisions with the user's
 * existing preference names for the same resource.
 * @param {string} name
 * @param {Set<string>} takenNames
 * @returns {string}
 */
function uniqueCopyName(name, takenNames) {
  let candidate = `${name} (copy)`;
  let n = 2;
  while (takenNames.has(candidate)) {
    candidate = `${name} (copy ${n})`;
    n++;
  }
  return candidate;
}

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
export async function injectBody(req, res, next) {
  if (!req.body) req.body = {};

  const userId = res.locals.consumer.userId;
  const { resource } = req.params;
  log.debug(
    () => `injectPreferenceBody(userId=${userId}, resource=${resource})`,
  );

  const rows = Array.isArray(req.body.rows) ? req.body.rows : [];

  if (rows.length === 0) {
    log.debug(() => `injectPreferenceBody: empty rows, skipping`);
    return res.json({ rows: [] });
  }

  // The front-end resends the whole preferences array (locked defaults included)
  // on every save, not just the row the user actually changed. Blindly upserting
  // every row would copy ALL locked (system, userId=-1) rows into user-owned
  // (locked=false) rows, making every preference lose its "locked" status after
  // a single unrelated change. Fetch the current system defaults (to detect
  // no-op saves) and the user's own existing preference names (to avoid copy-
  // name collisions), then drop any locked row that is unchanged.
  //
  // Deleting a preference has its own dedicated DELETE route/endpoint - this
  // PUT only ever inserts or updates rows, it never deletes.
  let defaultsByName = new Map();
  const existingUserNames = new Set();
  try {
    const { rows: existing } = await execute(
      `SELECT "userId", name, conf, "isActive" FROM preference WHERE "userId" IN (-1, $1) AND resource = $2`,
      [userId, String(resource)],
      null,
    );
    for (const r of existing) {
      if (r.userId === -1) defaultsByName.set(r.name, r);
      else existingUserNames.add(r.name);
    }
  } catch (err) {
    return next(err);
  }

  // A locked row can differ from its system default in two independent ways:
  // - isActive only (the user just activated this preset): fork it under the
  //   SAME name, shadowing the locked original (existing behavior).
  // - conf (visibility/order/width actually customized): this is a genuine
  //   personalization, so fork it as a NEW, distinctly-named view instead of
  //   shadowing the original - both remain visible/selectable independently.
  const changedRows = [];
  for (const row of rows) {
    if (!row.locked) {
      changedRows.push(row);
      continue;
    }
    const def = defaultsByName.get(row.name);
    if (!def) {
      changedRows.push(row);
      continue;
    }
    const confChanged = !confEquals(def.conf, row.conf);
    const isActiveChanged = def.isActive !== row.isActive;
    if (!confChanged && !isActiveChanged) continue;
    if (confChanged) {
      row.name = uniqueCopyName(row.name, existingUserNames);
      existingUserNames.add(row.name);
    }
    changedRows.push(row);
  }

  if (changedRows.length === 0) {
    log.debug(() => `injectPreferenceBody: no changed rows, skipping`);
    return res.json({ rows: [] });
  }

  // Include changed rows only (locked or not).
  // - locked=true rows are system defaults: antity-pgsql ignores the 'locked' and 'id'
  //   fields during INSERT (they are SELECT-only), so they will be created as user-owned
  //   copies with the DB default locked=false.
  // - locked=false rows are existing user preferences: they will be updated.
  // The upsert conflict target (userId, resource, name) handles both cases safely.
  req.body.rows = changedRows.map(
    /** @param {any} row */ (row) => ({
      ...row,
      userId,
      resource,
    }),
  );

  // Use upsert conflict resolution: INSERT the row if (userId, resource, name) doesn't
  // exist yet, otherwise UPDATE it. This avoids the duplicate key error that sync caused
  // when frontend sent back system default rows with IDs not in the user's scope.
  req.body.conflictTarget = ["userId", "resource", "name"];

  next();
}
