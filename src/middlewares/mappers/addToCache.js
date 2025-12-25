// @ts-check
import { log } from "@dwtechs/winstan";
import csmerSvc from "../../services/consumer.js";

/**
 * Adds newly created consumer to cache after successful database insertion
 * Final middleware in addConsumer stack of POST /consumers route
 * 
 * @param {Object} req - Express request
 * @param {Object} req.body - Request body (not used by this middleware)
 * 
 * @param {Object} res - Express response
 * @param {Object} res.locals - Consumer object from database
 * @param {number} res.locals.id - Consumer ID
 * @param {string} res.locals.nickname - Consumer nickname
 * @param {string} res.locals.accessToken - JWT access token
 * @param {string} res.locals.refreshToken - JWT refresh token
 * @param {Array} res.locals.rolesArrayAgg - Array of user roles
 * 
 * @param {Function} next - Express next function
 * 
 * @modifies None - only adds to in-memory cache
 * 
 * INPUT:
 *   req.body.rows[0] = { id, nickname, accessToken, refreshToken, rolesArrayAgg, ... }
 * 
 * OUTPUT:
 *   No changes - consumer added to cache only
 */
export default function addToCache(req, res, next) {
  const c = req.body.rows[0];

  log.debug(`Adding consumer ${c.id} to cache`);
  
  // Add consumer to cache
  csmerSvc.addCache(c);

  next();
}
