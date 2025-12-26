// @ts-check
import { log } from "@dwtechs/winstan";
import http from "../../services/http.js";

const { MSUSER_URL } = process.env;
const url = `${MSUSER_URL}/users/`;

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
 * @modifies req.body.rows[0] - Adds userId property from ms_user response
 * @modifies res.locals - Sets nickname and rolesArrayAgg from ms_user response
 * 
 * INPUT:
 *   req.body.rows[0] = { email: string, pwd: string }
 *   res.locals = {}
 * 
 * OUTPUT:
 *   req.body.rows[0] = { email: string, pwd: string, userId: number }
 *   res.locals = { nickname: string, rolesArrayAgg: array }
 */
export default function getUserByEmail(req, res, next) {
  const { email } = req.body; // Get email from request body
  const filters = { // Create filters for the query
    email: { 
      value: email, 
      matchMode: "equals" 
    },
    archived: { 
      value: false, 
      matchMode: "is" 
    },
  };
  const headers = req.additionalHeaders || {};
  http
    .query("POST", url, null, { filters }, headers)
    .then((r) => {
      const u = r.data.rows[0];
      log.debug(`ms_user response: user id=${u.id}, nickname=${u.nickname}, email=${u.email}`);
      req.body.rows = [{
        userId: u.id,
        nickname: u.nickname,
        rolesArrayAgg: u.rolesArrayAgg
      }];
      res.locals = { id: u.id, active: u.active };
      next();
    })
    .catch((err) => next(err));
}
