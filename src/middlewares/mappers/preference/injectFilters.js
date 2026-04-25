// @ts-check
import { log } from "@dwtechs/winstan";

/**
 * Express middleware that injects userId (from the JWT session) and resource
 * (from the URL param) into the filters sent by the front-end.
 *
 * @param {import('express').Request} req
 * @param {Object} req.params
 * @param {string} req.params.resource - Table/component identifier from URL
 * @param {import('express').Response} res
 * @param {number} res.locals.consumer.userId - Authenticated user ID
 * @param {import('express').NextFunction} next
 */
export function injectFilters(req, res, next) {
  const userId = res.locals.consumer.userId;
  const { resource } = req.params;
  log.debug(
    () => `injectPreferenceFilters(userId=${userId}, resource=${resource})`,
  );

  req.body = {
    filters: {
      userId: { value: [-1, userId], matchMode: "in" },
      resource: { value: resource, matchMode: "equals" },
    },
    sortField: "name",
    sortOrder: 1,
  };

  next();
}
