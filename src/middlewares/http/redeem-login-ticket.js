// @ts-check
import { isString, isValidInteger } from "@dwtechs/checkard";
import { log } from "@dwtechs/winstan";
import http from "../../utils/http.js";

/**
 * @returns {string}
 */
function pwdBaseUrl() {
  const check = process.env.PWD_CHECK_URL || "";
  return check.replace(/\/pwd\/compare\/?$/i, "");
}

/**
 * Redeem Foxnox login-resume ticket → attach user like getUserByEmail.
 * Expects `req.body.ticket`.
 *
 * @type {import('express').RequestHandler}
 */
export function redeemLoginTicket(req, res, next) {
  const ticket = String(req.body?.ticket ?? "").trim();
  if (!ticket) {
    return next({ statusCode: 400, message: "Missing ticket" });
  }

  const redeemUrl = `${pwdBaseUrl()}/pwd/login-tickets/redeem`;
  http
    .query("POST", redeemUrl, undefined, { ticket })
    .then((r) => {
      const userId = Number(r?.data?.userId);
      if (!isValidInteger(userId, 1, undefined, true)) {
        return next({ statusCode: 400, message: "Invalid ticket" });
      }

      const filters = {
        id: { value: userId, matchMode: "equals" },
      };
      return http
        .query(
          "POST",
          process.env.USER_SEARCH_URL,
          undefined,
          { filters },
          undefined,
        )
        .then((userRes) => {
          const u = userRes.data?.rows?.[0];
          const { id, nickname, email, roles, active } = u ?? {};
          if (!isValidInteger(id, 1, undefined, true)) {
            return next({ statusCode: 422, message: "Invalid user id" });
          }
          if (!isString(nickname, "!0")) {
            return next({ statusCode: 422, message: "Invalid user nickname" });
          }
          log.debug(
            () =>
              `login-ticket resume: id=${id}, nickname=${nickname}, email=${email}`,
          );
          req.body.rows = [{ userId: id, nickname, roles }];
          res.locals.user = { id, active };
          req.body.userId = id;
          next();
        });
    })
    .catch((err) => next(err));
}
