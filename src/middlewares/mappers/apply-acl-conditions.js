// @ts-check
import { log } from "@dwtechs/winstan";
import conditionOpSvc from "../../services/condition-op.js";

/**
 * Middleware that injects ACL conditions set by check-acl into req.body.filters.
 * Applies to internal search endpoints so that permission conditions
 * (e.g. `archived = false`) are enforced at query level.
 *
 * The `op` value on each ACL condition is validated against the static
 * allowlist exposed by the `condition-op` service, which is a code-level
 * mirror of the DB `chk_condition_op` CHECK constraint declared in
 * db/liquibase/gateway/versions/03-struct/14-condition.sql (see that service
 * for the sync policy). Any op not in that set is dropped and logged — never
 * silently forwarded — which prevents the class of bug flagged by the audit
 * where an unrecognized op reaches `@dwtechs/antity-pgsql`'s
 * `mapComparator()`, returns `null`, and the ACL WHERE fragment vanishes
 * entirely.
 *
 * All DB-allowed ops (`=`, `!=`, `<`, `>`, `<=`, `>=`) are also valid
 * `matchMode` inputs for `@dwtechs/antity-pgsql` >= 0.21.5, so `op` can be
 * forwarded as `matchMode` without translation.
 *
 * Does not mutate `req.aclConditions` — downstream middleware
 * (see additionalHeaders) still forwards the original `{ field, op, value }`
 * shape to proxied services via the `x-acl-conditions` header.
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
      if (!conditionOpSvc.isAllowed(op)) {
        log.warn(
          () =>
            `applyAclConditions: dropping ACL condition with unsupported op "${op}" on field "${field}"`,
        );
        continue;
      }
      req.body.filters[field] = [{ value, matchMode: op }];
    }
  }
  next();
}
