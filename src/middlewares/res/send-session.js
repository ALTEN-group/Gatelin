// @ts-check
import { deleteProps } from "@dwtechs/sparray";
import sEnt from "../../entities/session.js";
import roleSvc from "../../services/role.js";

/**
 * Express middleware that sends a single session object as JSON response.
 * Removes unsafe properties from the session data before sending.
 * Includes permissions resolved from the consumer's roles.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} _next - Express next function (unused)
 * @return {void} Sends JSON response with session data
 * @example
 * // Use as final middleware in route
 * router.post('/sessions', addSession, sendSession);
 */
export function sendSession(req, res, _next) {
  const roleIds = req.body.rows[0]?.roles ?? [];
  const permissions = roleIds.flatMap(
    (id) => roleSvc.getOne(id)?.permissions ?? [],
  );
  const data = deleteProps(req.body.rows, sEnt.privateProps);
  res.status(200).json({ ...data[0], permissions });
}
