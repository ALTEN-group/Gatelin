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

  // Filter out system defaults (userId === -1) so they are never upserted
  // under the current user's account when the frontend sends them back wholesale.
  req.body.rows = rows
    .filter((row) => row.userId !== -1)
    .map((row) => ({
      ...row,
      userId,
      resource,
    }));

  // Scope the sync operation to the current user's own preferences only.
  // Without this filter, syncArraySubstack would SELECT all rows for the resource
  // (including system defaults with userId=-1) and delete any not present in the payload.
  req.body.filters = {
    userId: { value: userId, matchMode: "equals" },
    resource: { value: resource, matchMode: "equals" },
  };

  next();
}
