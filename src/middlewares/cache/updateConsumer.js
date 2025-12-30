// @ts-check
import { log } from "@dwtechs/winstan";
import csmerSvc from "../../services/consumer.js";

/**
 * Updates consumer tokens in cache after successful database update
 * Middleware in updateConsumer stack of PUT /consumers route
 * 
 * @param {Object} req - Express request
 * @param {Object} req.body - Request body
 * @param {Array} req.body.rows - Array with updated consumer data
 * 
 * @param {Object} res - Express response
 * @param {Object} res.locals - Response locals
 * 
 * @param {Function} next - Express next function
 * 
 * @modifies Updates in-memory consumer cache with new tokens
 * 
 * INPUT:
 *   req.body.rows[0] = { id, accessToken, refreshToken }
 * 
 * OUTPUT:
 *   Cache updated with new tokens for the consumer
 */
export default function updateCache(req, res, next) {
  const c = req.body.rows[0];
  log.debug(`Updating consumer ${c.id} in cache`);

  // Update consumer in cache
  csmerSvc.updateCache(c.id, c.accessToken, c.refreshToken);
  
  next();
}



