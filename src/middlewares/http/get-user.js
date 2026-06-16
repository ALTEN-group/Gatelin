// @ts-check
import { log } from "@dwtechs/winstan";
import { isString, isArray } from "@dwtechs/checkard";
import http from "../../utils/http.js";

const { USER_SEARCH_URL } = process.env;
const url = USER_SEARCH_URL;

/**
 * Fetches user details from ms_user service by email
 * Part of checkEmail middleware stack in POST /consumers route
 *
 * @param {Object} req - Express request
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email to look up
 * @param {string} req.body.pwd - User password (passed through)
 * @param {Object} [req.additionalHeaders] - Optional additional headers
 *
 * @param {Object} res - Express response
 * @param {Object} res.locals - Response locals object
 *
 * @param {Function} next - Express next middleware
 *
 * @modifies req.body.rows[0] - Adds nickname and roles properties from ms_user response
 * @modifies res.locals - Sets id and active from ms_user response
 *
 * INPUT:
 *   req.body = { email: string, pwd: string }
 *   res.locals = {}
 *
 * OUTPUT:
 *   req.body = { rows: [{ userId: number, nickname: string, roles: number[] }]}
 *   res.locals = { user: { id: string, active: boolean } }
 */
export function getUserByEmail(req, res, next) {
  const filters = {
    email: {
      value: req.body.email,
      matchMode: "equals",
    },
    archived: {
      value: false,
      matchMode: "is",
    },
  };

  http
    .query("POST", url, undefined, { filters }, undefined)
    .then((r) => {
      const u = r.data.rows[0]; // Expecting single user object
      // if (!isObject(u)) return next({ statusCode: 404, message: "User not found" });
      const { id, nickname, email, roles, active } = u ?? {};
      if (!isString(nickname, "!0")) return next({ statusCode: 422, message: "Invalid user nickname" });
      if (!isArray(roles, "!0")) return next({ statusCode: 422, message: "Invalid user roles" });
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

export function getUserById(req, res, next) {
  const filters = {
    id: {
      value: res.locals.consumer.userId,
      matchMode: "equals",
    },
    archived: {
      value: false,
      matchMode: "equals",
    },
    active: {
      value: true,
      matchMode: "equals",
    },
  };

  http
    .query("POST", url, undefined, { filters }, undefined)
    .then((r) => {
      const u = r.data.rows[0]; // Expecting single user object
      // if (!isObject(u)) return next({ statusCode: 404, message: "User not found" });
      const { nickname, roles } = u ?? {};
      if (!isString(nickname, "!0")) return next({ statusCode: 422, message: "Invalid user nickname" });
      if (!isArray(roles, "!0")) return next({ statusCode: 422, message: "Invalid user roles" });
      log.debug(
        () =>
          `ms_user response: id=${u.id}, nickname=${nickname}, roles=${roles}`,
      );
      // Attach user data to request body for db update in downstream middleware
      Object.assign(req.body.rows[0], { nickname, roles });
      next();
    })
    .catch((err) => next(err));
}
