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
 *   req.body.rows[0] = { email: string, pwd: string, userId: number }
 *   res.locals = { nickname: string, rolesArrayAgg: array }
 * 
 * OUTPUT:
 *   No changes - validates credentials or throws error
 */
export default function checkPwd(req, res, next) {
  
  const userId = req.body.userId;
  const pwd = req.body.pwd;
  
  const filters = {
    userId: {
      value: userId,
      matchMode: "equals"
    },
    pwd: {
      value: pwd,
      matchMode: "equals"
    }
  };
  const headers = req.additionalHeaders || {};
  http
    .query("POST", url, null, { filters }, headers)
    .then(() => {
      next();
    })
    .catch((err) => next(err));
}
