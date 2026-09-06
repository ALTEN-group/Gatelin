// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import { isArray, isValidInteger } from "@dwtechs/checkard";
import pEnt from "../../../entities/permission.js";
import roleSvc from "../../../services/role.js";

const FORBIDDEN = {
  statusCode: 403,
  message: "Cannot grant a broader permission than the caller holds",
};

const LOCKED_ROLE = {
  statusCode: 403,
  message: "Cannot change permissions on a locked system role",
};

/**
 * Seeded first in `06-data/11-role.sql` as "Gatelin super admin". Admin is also
 * `locked`, so the caller's own `locked` flag cannot be the exemption.
 */
const SUPER_ADMIN_ROLE_ID = 1;

/**
 * `allowed === null` means the caller is unrestricted on that route, so every
 * grant passes. A `null` grant is itself unrestricted, so it only passes when
 * the caller is unrestricted too — that asymmetry is what stops a name-only
 * role manager from writing `fields: null` and inheriting the full column set.
 *
 * @param {unknown} granted
 * @param {Set<string>|null} allowed
 * @returns {boolean}
 */
function isGrantSubset(granted, allowed) {
  if (allowed === null) return true;
  if (!isArray(granted)) return false;
  return granted.every((item) => allowed.has(item));
}

/**
 * Fail-closed pre-flight for permission writes: a caller may only attach or
 * remove a (route, operation, fields, scopes) set it already holds itself.
 *
 * Without it, Admin's unrestricted `addPermissions` grant mints Super-admin
 * field lists (CORS `credentials`, for instance) onto any role including its
 * own, and `reloadRoles` puts them into effect on the same request.
 *
 * POST rows are judged as sent. PUT and DELETE may carry only an `id`, so the
 * stored row is read first and the payload merged over it — otherwise an
 * id-only body would widen `fields` with nothing to compare against. A missing
 * id rejects the whole batch, matching `assertRowsOwnedAndUnlocked`: the write
 * layer batches on `id`, so partial authorization is not representable.
 *
 * Locked system roles (Super-admin, Admin, User, Guest) are a second ceiling:
 * subset would still let Admin delete overlapping Super-admin grants. Non
 * Super-admin callers may only write permissions onto unlocked (custom) roles.
 * A missing target in the role cache is treated as locked (fail-closed).
 *
 * Unprotected routes skip the check, same contract as `checkAcl`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
export async function assertGrantSubset(req, res, next) {
  if (!res.locals.route?.protected) return next();

  const roleIds = res.locals.consumer?.roles;
  if (!isArray(roleIds, "!0"))
    return next({ statusCode: 401, message: "Unauthorized" });

  const rows = req.body?.rows;
  if (!isArray(rows, "!0"))
    return next({ statusCode: 400, message: "Missing rows in req.body" });

  let candidates = rows;

  if (req.method !== "POST") {
    const ids = rows
      .map((r) => r?.id)
      .filter((v) => isValidInteger(v, 1, undefined, true));
    if (ids.length !== rows.length)
      return next({
        statusCode: 400,
        message: "Every row must carry a valid integer id",
      });

    const { query, args } = pEnt.query.select(0, null, null, null, {
      id: { value: ids, matchMode: "in" },
    });
    try {
      const r = await execute(query, args, null);
      const stored = r.rows ?? [];
      if (stored.length !== ids.length) return next(FORBIDDEN);
      const byId = new Map(stored.map((row) => [Number(row.id), row]));
      candidates = rows.map((row) => ({
        ...byId.get(Number(row.id)),
        ...row,
      }));
    } catch (err) {
      return next(err);
    }
  }

  const isSuperAdmin = roleIds.some((id) => Number(id) === SUPER_ADMIN_ROLE_ID);

  for (const { roleId, routeId, operationId, fields, scopes } of candidates) {
    if (
      !isValidInteger(roleId, 1, undefined, true) ||
      !isValidInteger(routeId, 1, undefined, true) ||
      !isValidInteger(operationId, 1, undefined, true)
    )
      return next(FORBIDDEN);

    const target = roleSvc.getOne(roleId);
    if (!isSuperAdmin && (target == null || target.locked))
      return next(LOCKED_ROLE);

    // Merge every role the caller holds on this (route, operation): one role
    // with no restriction makes the caller unrestricted there, otherwise the
    // allow-lists union. `null` fields and empty scopes mean unrestricted,
    // same convention as checkAcl.
    let held = false;
    let anyField = false;
    let anyScope = false;
    const allowedFields = new Set();
    const allowedScopes = new Set();
    for (const id of roleIds) {
      const perm = roleSvc.getOne(id)?.permissions.get(routeId);
      if (!perm || !isArray(perm.operations, "!0")) continue;
      if (!perm.operations.some((op) => op === operationId)) continue;
      held = true;
      if (perm.fields == null) anyField = true;
      else if (isArray(perm.fields))
        for (const f of perm.fields) allowedFields.add(f);
      if (!isArray(perm.scopes, "!0")) anyScope = true;
      else for (const s of perm.scopes) allowedScopes.add(s);
    }

    if (
      !held ||
      !isGrantSubset(fields, anyField ? null : allowedFields) ||
      !isGrantSubset(scopes, anyScope ? null : allowedScopes)
    )
      return next(FORBIDDEN);
  }

  next();
}
