// @ts-check

/** @type {Record<string, string>} Maps condition.op values to antity-pgsql matchModes */

/**
 * Middleware that injects ACL conditions set by check-acl into req.body.filters.
 * Applies to internal search endpoints so that permission conditions (e.g. archived=false)
 * are enforced at query level.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export default function applyAclConditions(req, _res, next) {
  if (req.aclConditions?.length) {
    req.body ??= {};
    req.body.filters ??= {};
    for (const { field, op, value } of req.aclConditions) {
      if (op) req.body.filters[field] = [{ value, op }];
    }
  }
  next();
}
