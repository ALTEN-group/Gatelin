// @ts-check
import { deleteProps } from "@dwtechs/sparray";
import sEnt from "../../entities/session.js";

/**
 * Express middleware that sends a single session object as JSON response.
 * Removes unsafe properties from the session data before sending.
 * Expects permissions to be pre-resolved in res.locals.permissions
 * by the resolvePermissions middleware.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} _next - Express next function (unused)
 * @return {void} Sends JSON response with session data
 * @example
 * // Use as final middleware in route
 * router.post('/sessions', addSession, sendSession);
 */
export function sendSession(_req, res, _next) {
  const permissions = res.locals.permissions ?? [];
  const data = deleteProps(res.locals.rows, sEnt.privateProps);
  res.status(200).json({ ...data[0], permissions });
}
