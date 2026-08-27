// @ts-check
import { checkUrl } from "../../conf/pwd.js";
import http from "../../utils/http.js";

/**
 * Validates user credentials against the password service (Foxnox `/foxnox/compare`).
 * On success, stores the public pwd row on `res.locals.pwdRow` for login gating.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function checkPwd(req, res, next) {
  const { userId, pwd } = req.body;
  const headers = req.additionalHeaders || {};
  http
    .query("POST", checkUrl, undefined, { userId, pwd }, headers)
    .then((result) => {
      const row = result?.data?.rows?.[0] ?? null;
      res.locals.pwdRow = row;
      next();
    })
    .catch((err) => next(err));
}
