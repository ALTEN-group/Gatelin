// @ts-check
import { log } from "@dwtechs/winstan";

/**
 * Express middleware that injects userId (from the JWT session) and tableName
 * (from the URL param) into the filters sent by the front-end.
 *
 * @param {import('express').Request} req
 * @param {Object} req.params
 * @param {string} req.params.tableName - Table/component identifier from URL
 * @param {import('express').Response} res
 * @param {number} res.locals.consumer.userId - Authenticated user ID
 * @param {import('express').NextFunction} next
 */
export function injectFilters(req, res, next) {
  const userId = res.locals.consumer.userId;
  const { tableName } = req.params;
  log.debug(`injectPreferenceFilters(userId=${userId}, tableName=${tableName})`);

  req.body = {
    filters: {
      userId:    { value: userId,    matchMode: "equals" },
      tableName: { value: tableName, matchMode: "equals" },
    },
    sortField: "name",
    sortOrder: 1,
  };

  next();
}
