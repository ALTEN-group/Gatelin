// @ts-check
import { log } from "@dwtechs/winstan";
import csmerSvc from "../../services/consumer.js";

const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";

/**
 * Express middleware that looks up the authenticated consumer in the
 * in-memory cache using the refresh token (from `req.body.refreshToken` or
 * the `refreshToken` cookie), independently of any access token. On success,
 * attaches the full consumer record to `res.locals.consumer`, same contract
 * as `checkConsumer`, so downstream middlewares (`checkCsrf`,
 * `checkRefreshToken`, `updateSession`, ...) can read from it.
 *
 * NOT a complete authentication check on its own — same split as
 * `checkConsumer`/`csmerSvc.getOne`: this only proves the refresh token
 * exists in the cache. `checkRefreshToken` still runs afterward to do the
 * constant-time comparison against `res.locals.consumer.refreshToken`.
 *
 * Used only in the session refresh (`PUT /sessions`) flow, where the client
 * may have no access token at all (see `src/routes/session.js`).
 *
 * @param {import('express').Request} req - Express request.
 *   Reads: `req.body.refreshToken` or `req.cookies[refreshToken]`.
 * @param {import('express').Response} res - Express response.
 *   Writes: `res.locals.consumer` on success.
 * @param {import('express').NextFunction} next - Express next function.
 *   Called with no args on success, or with `{ statusCode: 401,
 *   message: "Unauthorized" }` if no refresh token is present or it is not
 *   found in the cache.
 * @return {void}
 */
export default function checkConsumerByRefreshToken(req, res, next) {
  if (!res.locals.route?.protected) return next();

  const rt = req.body?.refreshToken ?? req.cookies?.[cookieName];
  if (!rt) return next({ statusCode: 401, message: "Unauthorized" });
  log.debug(() => "checkConsumerByRefreshToken(refreshToken=<present>)");
  const c = csmerSvc.getByRefreshToken(rt);

  if (!c) return next({ statusCode: 401, message: "Unauthorized" });

  log.debug(() => `checkConsumerByRefreshToken(Consumer: ${c.id})`);
  res.locals.consumer = c;
  next();
}
