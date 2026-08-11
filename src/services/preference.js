// @ts-check
import { execute } from "@dwtechs/antity-pgsql";

/**
 * Fetches the merged list of preferences available for a resource from the
 * `preferences` view (templates, "userId" IS NULL / locked=true, and this
 * user's own preference rows, locked=false). "isActive" reflects this user's
 * own preference_selection row (preferenceId points at either a template or
 * a personal row - both live in the same `preference` table now).
 *
 * NOTE: no fallback default when the user has no preference_selection row
 * yet for this resource - "isActive" is simply false for every row in that
 * case. There's no more per-resource "system default" flag (that concept
 * only existed in the old preference_template/preference_selection model).
 *
 * @param {number} userId
 * @param {string} resource - resource name (matched against "resourceName")
 * @returns {Promise<Array<object>>}
 */
export async function getMany(userId, resource) {
	const { rows } = await execute(
		`SELECT v.id, v."resourceId", v."resourceName", v.name, v.conf, v.locked,
            COALESCE(v.id = ps."preferenceId", false) AS "isActive"
     FROM preferences v
     LEFT JOIN preference_selection ps ON ps."resourceId" = v."resourceId" AND ps."userId" = $1
     WHERE v."resourceName" = $2 AND (v.locked OR v."userId" = $1)
     ORDER BY v.name`,
		[userId, resource],
		null,
	);
	return rows;
}
