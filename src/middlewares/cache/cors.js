// @ts-check
import corsSvc from "../../services/cors.js";

/**
 * Middleware to add CORS origin(s) to the cache after database insertion.
 * Expects req.body.rows to contain the newly created CORS origin(s).
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} _res - Express response object (unused)
 * @param {import('express').NextFunction} next - Express next function
 */
export function addToCache(req, _res, next) {
	if (req.body.rows && Array.isArray(req.body.rows)) {
		req.body.rows.forEach((corsOrigin) => {
			corsSvc.addToCache(corsOrigin);
		});
	}
	next();
}

/**
 * Middleware to update CORS origin in the cache after database update.
 * Expects req.body.rows to contain the updated CORS origin data.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} _res - Express response object (unused)
 * @param {import('express').NextFunction} next - Express next function
 */
export function updateCache(req, _res, next) {
	if (req.body.rows && Array.isArray(req.body.rows)) {
		req.body.rows.forEach((corsOrigin) => {
			corsSvc.updateCache(corsOrigin.id, corsOrigin.name);
		});
	}
	next();
}

/**
 * Middleware to delete CORS origin(s) from the cache after database deletion.
 * Expects req.body.rows to contain the deleted CORS origin ID(s).
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} _res - Express response object (unused)
 * @param {import('express').NextFunction} next - Express next function
 */
export function deleteFromCache(req, _res, next) {
	if (req.body.rows && Array.isArray(req.body.rows)) {
		req.body.rows.forEach((corsOrigin) => {
			corsSvc.deleteFromCache(corsOrigin.id);
		});
	}
	next();
}
