// @ts-check

/**
 * SQL operators accepted for `condition.op` in ACL / permission conditions.
 *
 * ============================================================================
 *  MUST BE KEPT IN SYNC WITH THE DB CHECK CONSTRAINT
 * ============================================================================
 *  db/liquibase/gateway/versions/03-struct/14-condition.sql, line 6:
 *
 *    CONSTRAINT chk_condition_op CHECK (op IN ('=', '!=', '<', '>', '<=', '>='))
 *
 *  Any change here MUST land in the same PR as the matching Liquibase migration
 *  (and vice versa). The two sets fail closed if they diverge — an op that
 *  exists on only one side becomes an unusable no-op at request time — but
 *  divergence still hides intent from the audit trail, so treat them as one
 *  atomic change.
 * ============================================================================
 *
 * Why hardcoded rather than reflected from the DB CHECK constraint at boot:
 *   - `information_schema.check_constraints` has a `pg_has_role(owner, 'USAGE')`
 *     predicate baked into its view definition and hides rows from any role
 *     that isn't a member of the constraint owner's role. Since Liquibase runs
 *     as SUPERUSER and Gatelin's runtime user is a separate non-inheriting
 *     role, every attempt to reflect the constraint fails to find it (this
 *     was a real outage on 2026-08-11 after `chk_condition_op` was reset).
 *   - Working around the visibility filter requires either a hand-rolled view
 *     over `pg_catalog.pg_constraint`, table-ownership changes, or role
 *     membership grants — all of which are non-trivial ops surface for a
 *     six-element allowlist that only changes when we ship an intentional
 *     schema migration anyway.
 *   - Reflecting DDL at runtime turns a defensive INSERT-time guard (which is
 *     what a CHECK constraint IS) into a runtime configuration source (which
 *     is a category the CHECK constraint was never designed to be). Mainstream
 *     frameworks (Rails, Django, Prisma, SQLAlchemy) all hardcode operator
 *     allowlists for the same reason: operator semantics is behavior, and
 *     behavior belongs in code review, not a migration diff.
 *   - Drift risk between the two sources is real but low-consequence: the
 *     intersection is what actually works, and either direction of drift
 *     fails closed (unknown ops on either side become inert no-ops with
 *     `applyAclConditions` warn-logging the request-side drop).
 *
 * @type {ReadonlySet<string>}
 */
const ALLOWED_OPS = new Set(["=", "!=", "<", ">", "<=", ">="]);

/**
 * True iff `op` is a string matching the DB's `chk_condition_op` allowlist.
 * Used by `applyAclConditions` to fail-closed on unknown/renamed operators
 * before they reach `@dwtechs/antity-pgsql`'s comparator mapper (where an
 * unknown value would silently return `null` and drop the WHERE clause —
 * the exact class of bug flagged by the 2026-08 audit).
 *
 * @param {unknown} op
 * @returns {boolean}
 */
function isAllowed(op) {
	return typeof op === "string" && ALLOWED_OPS.has(op);
}

/**
 * Returns a defensive copy of the allowlist for logs and admin endpoints.
 * External callers cannot mutate the internal set — Set is not immutable
 * under `Object.freeze` (freeze doesn't intercept `add`/`delete`), so we
 * hand out a copy rather than the source of truth.
 *
 * @returns {Set<string>}
 */
function getAll() {
	return new Set(ALLOWED_OPS);
}

export default {
	isAllowed,
	getAll,
};
