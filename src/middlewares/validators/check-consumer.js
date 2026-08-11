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
 * Express middleware that validates JWT tokens by matching access and refresh tokens
 * against stored consumer data. Checks cache first, then database if needed.
 * This middleware ensures that the tokens provided match the tokens stored in the
 * consumer cache/database, preventing token replay attacks and ensuring token authenticity.
 *
 * @param {import('express').Request} req - Express request object containing accessToken and refreshToken in body
 * @param {import('express').Response} res - Express response object for sending HTTP responses
 * @param {import('express').NextFunction} next - Express next function to pass control to the next middleware
 * @return {void} Calls next() on success or next(error) on validation failure
 * @throws {object} Returns 404 error if consumer not found, or 401 error if tokens don't match
 * @example
 * // Use as Express middleware after JWT decoding
 * import { checkToken } from './middlewares/validators/check-token.js';
 * app.post('/refresh', decodeRefreshToken, checkToken, refreshTokens);
 *
 * // After successful validation, req object will have:
 * // req.consumer - complete consumer object from cache
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
