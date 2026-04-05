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

  req.body.rows = rows.map((row) => ({
    ...row,
    userId,
    resource,
  }));

  next();
}
