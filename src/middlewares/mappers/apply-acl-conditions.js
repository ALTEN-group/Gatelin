// @ts-check

/** @type {Record<string, string>} Maps condition.op values to antity-pgsql matchModes */
const OP_TO_MATCH_MODE = {
  "=": "equals",
  "!=": "notEquals",
  "<": "lt",
  "<=": "lte",
  ">": "gt",
  ">=": "gte",
};

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
      const matchMode = OP_TO_MATCH_MODE[op];
      if (matchMode)
        req.body.filters[field] = [{ value, matchMode, operator: "and" }];
    }
  }
  next();
}
