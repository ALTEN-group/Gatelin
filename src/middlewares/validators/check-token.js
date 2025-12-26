// @ts-check
import { log } from "@dwtechs/winstan";

import csmerSvc from "../../services/consumer.js";

/**
 * @typedef {object} Consumer
 * @property {number} id - The unique identifier of the consumer
 * @property {string} nickname - The consumer's nickname
 * @property {string} accessToken - The consumer's access token
 * @property {string} refreshToken - The consumer's refresh token
 * @property {number} maxLevel - The maximum access level for the consumer
 * @property {Array<string>} roles - Array of roles assigned to the consumer
 */

/**
 * @typedef {object} ExtendedRequest
 * @property {object} body - Request body containing tokens
 * @property {string} body.accessToken - The access token to validate
 * @property {string} body.refreshToken - The refresh token to validate
 * @property {object} decodedRefreshToken - Previously decoded refresh token
 * @property {string} decodedRefreshToken.iss - The issuer (consumer ID) from decoded token
 * @property {Consumer} consumer - Consumer object added by this middleware
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
export default async function checkToken(req, res, next) {
  
  const { accessToken, refreshToken } = req.body;
  // @ts-ignore - Custom property added by previous middleware
  const consumerId = req.decodedRefreshToken.iss;
  log.debug(`Check token for consumer ${consumerId}`);

  const c = await csmerSvc.getOne(consumerId);
  
  if (!c) {
    return next({
      status: 404,
      msg: "Consumer not found",
    });
  }
  
  log.debug(`Consumer found: ${JSON.stringify(c)}`);

  // Validate both access and refresh tokens against stored values
  if (c.accessToken !== accessToken)
    return next({
      status: 401,
      msg: "Access token does not match consumer access token",
    });
  if (c.refreshToken !== refreshToken)
    return next({
      status: 401,
      msg: "Refresh token does not match consumer refresh token",
    });
  
  // Both tokens are valid, add consumer to request and continue
  // @ts-ignore - Adding custom property to Express request
  req.consumer = c;
  next();

}
