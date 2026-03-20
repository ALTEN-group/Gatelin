// @ts-check
import { log } from "@dwtechs/winstan";

/**
 * Express middleware that injects userId (from the JWT session) and tableName
 * (from the URL param) into each row of req.body.rows sent by the front-end.
 * Also maps the frontend field name conf → value to match the DB schema.
 *
 * @param {import('express').Request} req
 * @param {Object} req.body
 * @param {Array<object>} req.body.rows - Rows from the client
 * @param {Object} req.params
 * @param {string} req.params.tableName - Table/component identifier from URL
 * @param {import('express').Response} res
 * @param {number} res.locals.consumer.userId - Authenticated user ID
 * @param {import('express').NextFunction} next
 */
export function injectBody(req, res, next) {
  if (!req.body) req.body = {};

  const userId = res.locals.consumer.userId;
  const { tableName } = req.params;
  log.debug(`injectPreferenceBody(userId=${userId}, tableName=${tableName})`);

  const rows = Array.isArray(req.body.rows) ? req.body.rows : [];

  req.body.rows = rows.map((row) => ({
    ...row,
    userId,
    tableName,
    // normalise frontend shape: conf → value (DB column name)
    value: row.conf ?? row.value,
    conf: undefined,
  }));

  next();
}
