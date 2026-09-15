// @ts-check
import { isArray, isProperty } from "@dwtechs/checkard";

/**
 * After checkAcl strips unwritable fields, a name-only CORS update would keep
 * credentials=true (DB leaves the column alone; the cache preserves the old
 * flag). Admin can then point a Super-admin credentialed origin at an attacker
 * URL. If the payload changes `name` without asserting `credentials`, force
 * false before the UPDATE so the database and cache stay in sync.
 *
 * Super admin keeps the flag by sending `credentials: true` with the rename.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function dropInheritedCredentials(req, _res, next) {
  if (!isArray(req.body?.rows)) return next();
  for (const row of req.body.rows) {
    if (isProperty(row, "name") && !isProperty(row, "credentials"))
      row.credentials = false;
  }
  next();
}
