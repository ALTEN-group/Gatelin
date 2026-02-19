// @ts-check
import http from "../../services/http.js";

const { MSAUTH_URL } = process.env;
const url = `${MSAUTH_URL}/login/`;

/**
 * Validates user credentials against ms_auth service
 * Part of the POST /consumers route authentication flow
 * 
 * @param {Object} req - Express request
 * @param {Object} req.body
 * @param {Array} req.body.rows - Array with user credentials
 * @param {number} req.body.rows[0].userId - User ID to authenticate
 * @param {string} req.body.rows[0].pwd - Password to validate
 * @param {string} [req.body.rows[0].email] - User email (passed through)
 * @param {Object} [req.additionalHeaders] - Optional additional headers
 * 
 * @param {Object} res - Express response
 * @param {Object} res.locals - Response locals (unchanged by this middleware)
 * 
 * @param {Function} next - Express next middleware
 * 
 * @modifies None - validation only, no modifications to req or res
 * 
 * INPUT:
 *   req.body = { email: string, pwd: string, rows: [ { nickname: string, roles: number[] } ] }
 *   res.locals.user = { id: string }
 * 
 * OUTPUT:
 *   No changes - validates credentials or throws error
 */
export function checkPwd(req, res, next) {
  
  const id = res.locals.user.id; // user id from previous middleware
  const pwd = req.body.pwd; // password from request body
  
  const filters = {
    userId: {
      value: id,
      matchMode: "equals"
    },
    pwd: {
      value: pwd,
      matchMode: "equals"
    }
  };
  const headers = req.additionalHeaders || {};
  http
    .query("POST", url, undefined, { filters }, headers)
    .then(() => {
      next(); // Password is valid, proceed to next middleware
    })
    .catch((err) => next(err)); // Password is invalid
}
