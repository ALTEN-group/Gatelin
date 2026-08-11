// @ts-check
import { log } from "@dwtechs/winstan";
import csmerSvc from "../../services/consumer.js";

/**
 * @typedef {object} Consumer
 * @property {number} id - The unique identifier of the consumer
 * @property {number} userId - The user ID from ms_user service
 * @property {string} accessToken - The consumer's access token
 * @property {string} refreshToken - The consumer's refresh token
 * @property {Array<string>} roles - Array of roles assigned to the consumer
 */

/**
 * Express middleware that looks up the authenticated consumer in the
 * in-memory cache using the access token attached to `res.locals.tokens.access`
 * by an upstream `decodeAccess` middleware (from `@dwtechs/toker-express`).
 * On success, attaches the full consumer record to `res.locals.consumer` so
 * downstream middlewares (notably `checkRefreshToken`, `checkAcl`,
 * `applyAclConditions`, `resolvePermissions`, `sendSession`) can read from it
 * without re-hitting the cache.
 *
 * NOT a complete authentication check on its own.
 * ---
 * This middleware only proves that the presented access token exists in the
 * cache — a WEAKER guarantee than "the caller presented matching access AND
 * refresh tokens." The refresh-token match is done in a SEPARATE middleware,
 * `check-refreshToken.js`, using `timingSafeEqual` for constant-time
 * comparison. Both MUST run to fully authenticate a refresh-flow request.
 *
 * The split is intentional (separation of concerns, correct crypto layer,
 * reusable cache accessor); see the docblock on `consumerSvc.getOne` in
 * `src/services/consumer.js` for the rationale.
 *
 * Actual wiring (src/routes/session.js):
 *   session PUT (refresh flow): ...checkRequest → checkCsrf →
 *                               checkRefreshToken → decodeAccess →
 *                               decodeRefresh → updateSession
 *   session GET/DELETE:         checkRequest (which itself contains
 *                               parseBearer → decodeAccess → checkConsumer →
 *                               checkAcl → applyAclConditions)
 *
 * Cache-only lookup — there is no database fallback. The cache is loaded at
 * boot by `consumerSvc.init()` and mutated on add/update/delete via the
 * cache middlewares in `src/middlewares/cache/consumer.js`.
 *
 * @param {import('express').Request} req - Express request object (unused
 *   here; the access token is read from `res.locals.tokens.access` set
 *   upstream, not from `req` directly).
 * @param {import('express').Response} res - Express response.
 *   Reads:  `res.locals.tokens.access` (set by upstream token-decode middleware).
 *   Writes: `res.locals.consumer` on success.
 * @param {import('express').NextFunction} next - Express next function.
 *   Called with no args on success, or with `{ statusCode: 401,
 *   message: "Unauthorized" }` if the access token is missing on
 *   `res.locals.tokens.access` OR is not found in the cache.
 * @return {Promise<void>}
 */
export default async function checkConsumer(req, res, next) {
  const at = res.locals.tokens?.access;
  if (!at) return next({ statusCode: 401, message: "Unauthorized" });
  log.debug(() => `checkConsumer(accessToken=<present>)`);
  const c = csmerSvc.getOne(at);

  if (!c) return next({ statusCode: 401, message: "Unauthorized" });

  log.debug(() => `checkConsumer(Consumer: ${c.id})`);
  res.locals.consumer = c;
  next();
}
