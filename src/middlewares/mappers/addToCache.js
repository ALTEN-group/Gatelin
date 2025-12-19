// @ts-check
import { log } from "@dwtechs/winstan";
import csmerSvc from "../../services/consumer.js";

/**
 * Middleware to add newly created consumer to cache after successful creation.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
export default function addToCache(req, res, next) {
  const c = res.rows[0];
  
  // if (!c || !c.accessToken) {
  //   log.error("addToCache: No consumer data with tokens found");
  //   return next({ status: 500, msg: "Consumer data incomplete" });
  // }

  log.debug(`Adding consumer ${c.id} to cache`);
  
  // Add consumer to cache
  csmerSvc.addCache(c);

  next();
}
