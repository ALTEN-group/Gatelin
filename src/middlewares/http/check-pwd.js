// @ts-check
import http from "../../utils/http.js";

const { PWD_CHECK_URL } = process.env;
const url = PWD_CHECK_URL;

/**
 * Validates user credentials against ms_auth service
 * Part of the POST /consumers route authentication flow
 *
 * @param {Object} req - Express request
 * @param {Object} req.body
 * @param {Object} req.body.filters
 * @param {Object} [req.additionalHeaders] - Optional additional headers
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
export function checkPwd(req, res, next) {
  const filters = req.body.filters;
  const headers = req.additionalHeaders || {};
  http
    .query("POST", url, undefined, { filters }, headers)
    .then(() => {
      next(); // Password is valid, proceed to next middleware
    })
    .catch((err) => next(err)); // Password is invalid
}
