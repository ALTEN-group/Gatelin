// @ts-check
import { execute } from "@dwtechs/antity-pgsql";

/**
 * Upserts the user's active view for a resource. Exactly one of templateId /
 * preferenceId must be set (enforced by the chk_preference_selection_xor
 * constraint) - the other must be null.
 *
 * @param {number} userId
 * @param {string} resource
 * @param {number | null} templateId
 * @param {number | null} preferenceId
 */
export async function upsertSelection(
  userId,
  resource,
  templateId,
  preferenceId,
) {
  await execute(
    `INSERT INTO preference_selection ("userId", resource, "templateId", "preferenceId")
     VALUES ($1, $2, $3, $4)
     ON CONFLICT ("userId", resource) DO UPDATE
     SET "templateId" = EXCLUDED."templateId", "preferenceId" = EXCLUDED."preferenceId"`,
    [userId, resource, templateId, preferenceId],
    null,
  );
}
