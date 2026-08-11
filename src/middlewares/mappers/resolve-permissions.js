// @ts-check
import roleSvc from "../../services/role.js";

/**
 * Merges a single role's route permission into the accumulator map, unioning
 * operations and fields in place when the route was already contributed by
 * another role.
 *
 * @param {Map<any, {route: any, operations: Set<any>, fields: Set<any>|null}>} permMap
 * @param {{route: any, operations: any[], fields: any[]|null}} p
 * @return {void}
 */
function mergeRoutePermission(permMap, p) {
	const existing = permMap.get(p.route);

	// First time this route is seen — seed the Sets from the cache arrays.
	if (!existing) {
		permMap.set(p.route, {
			route: p.route,
			operations: new Set(p.operations),
			fields: p.fields ? new Set(p.fields) : null,
		});
		return;
	}

	// Route already contributed by a previous role — merge in place.
	// Mutate the existing Set directly — no new array allocation per merge.
	for (const op of p.operations) existing.operations.add(op);

	// null means "no field restriction". If either side is null the merged
	// result must also be null (least restrictive wins).
	if (existing.fields === null) return;
	if (p.fields === null) existing.fields = null;
	else for (const f of p.fields) existing.fields.add(f);
}

/**
 * Express middleware that resolves and merges permissions from all roles assigned
 * to the authenticated consumer, then stores the result in res.locals.permissions
 * for downstream middlewares (e.g. sendSession).
 *
 * A consumer may have multiple roles. Each role grants permissions per route:
 * - operations: which ACL actions are allowed (read, list, export, …)
 * - fields:     which response fields are visible (null = unrestricted)
 *
 * When the same route appears in more than one role, permissions are merged:
 * - operations are unioned (deduped)
 * - fields are unioned; if either role is unrestricted (null), result is null
 *
 * The role cache (roleSvc) is pre-loaded at startup and only contains active
 * permissions — no runtime active-flag check is needed here.
 *
 * @param {import('express').Request} _req - Express request object (unused)
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @return {void}
 */
export function resolvePermissions(_req, res, next) {
	// Read the role IDs assigned to the consumer.
	// res.locals.rows[0] is the consumer record returned by sEnt.add / sEnt.update
	// via the RETURNING clause — roles were inserted/updated from req.body.rows[0].roles
	// which was populated upstream by getUserByEmail / getUserById.
	//
	// Fail-closed normalization: `?? []` collapses three "no roles" shapes
	// (missing rows, missing rows[0], null/undefined roles column) into an empty
	// array. This preserves the defensive intent signaled by `?.` and prevents
	// an unhandled TypeError on `roles.length` from the fast-path check below —
	// which would otherwise surface as a generic Express 500 for a consumer
	// whose upstream data is legitimately empty. Downstream behavior for an
	// empty array is already correct: the fast path is skipped, the multi-role
	// loop iterates zero times, and `res.locals.permissions` is set to `[]` —
	// consistent with the "role id not in cache" branches on lines below.
	const roles = res.locals.rows?.[0]?.roles ?? [];

	// Fast path: single role — no merging needed, map directly to output shape.
	if (roles.length === 1) {
		const perms = roleSvc.getOne(roles[0])?.permissions;
		// perms is a Map<routeId, permission> from the role cache.
		// Convert its values to an array and shape each entry for JSON output:
		// - operations is a cache array — spread into a new array so callers can't mutate the cache
		// - fields may be undefined in older cache entries; normalise to null
		res.locals.permissions = perms
			? [...perms.values()].map((p) => ({
					route: p.route,
					operations: [...p.operations],
					fields: p.fields ?? null,
				}))
			: []; // role not found in cache (stale token) — return empty permissions
		return next();
	}

	// Multi-role path: accumulate in a Map.
	// operations and fields are stored as Sets to allow O(1) in-place union,
	// avoiding repeated intermediate array allocations on every overlapping route.
	const permMap = new Map();

	for (const id of roles) {
		// Look up the role in the in-memory cache (Map<roleId, role>).
		// role.permissions is itself a Map<routeId, permission> built at startup.
		const perms = roleSvc.getOne(id)?.permissions;

		// Role not found in cache (stale token edge case) — skip silently.
		if (!perms) continue;

		for (const p of perms.values()) mergeRoutePermission(permMap, p);
	}

	// Serialise: convert Sets → Arrays for JSON output.
	res.locals.permissions = [...permMap.values()].map((e) => ({
		route: e.route,
		operations: [...e.operations],
		fields: e.fields ? [...e.fields] : null,
	}));
	next();
}
