// @ts-check

import { isArray, isString, isValidInteger } from "@dwtechs/checkard";
import { log } from "@dwtechs/winstan";
import http from "../../utils/http.js";

const { USER_SEARCH_URL } = process.env;
const url = USER_SEARCH_URL;

/**
 * Fetches user details from ms_user service by email
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
export function getUserByEmail(req, res, next) {
  const filters = req.body.filters;

  http
    .query("POST", url, undefined, { filters }, undefined)
    .then((r) => {
      const u = r.data.rows[0]; // Expecting single user object
      // if (!isObject(u)) return next({ statusCode: 404, message: "User not found" });
      const { id, nickname, email, roles, active } = u ?? {};
      if (!isValidInteger(id, 1, undefined, true))
        return next({ statusCode: 422, message: "Invalid user id" });
      if (!isString(nickname, "!0"))
        return next({ statusCode: 422, message: "Invalid user nickname" });
      if (!isArray(roles, "!0"))
        return next({ statusCode: 422, message: "Invalid user roles" });
      log.debug(
        () =>
          `ms_user response: id=${id}, nickname=${nickname}, email=${email}, roles=${roles}, active=${active}`,
      );
      req.body.rows = [
        // Attach user data to request body for db update in downstream middleware
        {
          userId: id,
          nickname,
          roles,
        },
      ];
      res.locals.user = { id, active }; // Attach user id and active for downstream middleware
      next();
    })
    .catch((err) => next(err));
}

/**
 * Fetches user details from ms_user service by id
 *
 * @param {Object} req - Express request
 * @param {Object} _res - Express response (unused)
 * @param {Function} next - Express next middleware
 */

export function getUserById(req, _res, next) {
  const filters = req.body.filters;

  http
    .query("POST", url, undefined, { filters }, undefined)
    .then((r) => {
      const u = r.data.rows[0]; // Expecting single user object
      // if (!isObject(u)) return next({ statusCode: 404, message: "User not found" });
      const { nickname, roles } = u ?? {};
      if (!isString(nickname, "!0"))
        return next({ statusCode: 422, message: "Invalid user nickname" });
      if (!isArray(roles, "!0"))
        return next({ statusCode: 422, message: "Invalid user roles" });
      log.debug(() => `ms_user response: nickname=${nickname}, roles=${roles}`);
      // Attach user data to request body for db update in downstream middleware
      Object.assign(req.body.rows[0], { nickname, roles });
      next();
    })
    .catch((err) => next(err));
}
