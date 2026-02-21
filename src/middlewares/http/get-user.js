// @ts-check
import { log } from "@dwtechs/winstan";
import http from "../../utils/http.js";

const { MSUSER_SEARCH_URL } = process.env;
const url = MSUSER_SEARCH_URL;

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
      log.debug(
        `ms_user response: id=${u?.id}, nickname=${u?.nickname}, email=${u?.email}, roles=${u?.roles}, active=${u?.active}`,
      );
      req.body.rows = [
        // Attach user data to request body for db update in downstream middleware
        {
          userId: u.id,
          nickname: u.nickname,
          roles: u.roles,
        },
      ];
      res.locals.user = { id: u.id, active: u.active }; // Attach user id and active for downstream middleware
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
      matchMode: "is",
    },
    active: {
      value: true,
      matchMode: "is",
    },
  };

  http
    .query("POST", url, undefined, { filters }, undefined)
    .then((r) => {
      const u = r.data.rows[0]; // Expecting single user object
      log.debug(
        `ms_user response: id=${u?.id}, nickname=${u?.nickname}, roles=${u?.roles}`,
      );
      // Attach user data to request body for db update in downstream middleware
      req.body.rows[0].nickname = u.nickname;
      req.body.rows[0].roles = u.roles;
      // res.locals.user = { id: u.id, active: u.active }; // Attach user id and active for downstream middleware
      next();
    })
    .catch((err) => next(err));
}
