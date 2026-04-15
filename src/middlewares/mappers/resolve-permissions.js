// @ts-check
import roleSvc from "../../services/role.js";

/**
 * Express middleware that resolves permissions from the consumer's roles
 * and stores them in res.locals.permissions for downstream middlewares.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @return {void}
 */
export function resolvePermissions(req, res, next) {
  const roleIds = req.body.rows[0]?.roles ?? [];
  const permMap = new Map();

  for (const id of roleIds) {
    const perms = roleSvc.getOne(id)?.permissions ?? [];
    for (const p of perms) {
      if (permMap.has(p.route)) {
        const existing = permMap.get(p.route);
        const operations = [...new Set([...existing.operations, ...p.operations])];
        // null means unrestricted — if either role is unrestricted, result is unrestricted
        const fields =
          existing.fields === null || p.fields === null
            ? null
            : [...new Set([...existing.fields, ...p.fields])];
        permMap.set(p.route, { route: p.route, operations, fields });
      } else {
        permMap.set(p.route, { route: p.route, operations: [...p.operations], fields: p.fields ?? null });
      }
    }
  }

  res.locals.permissions = Array.from(permMap.values());
  next();
}
