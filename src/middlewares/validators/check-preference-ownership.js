// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import { log } from "@dwtechs/winstan";
import { isNumber } from "@dwtechs/checkard";

/**
 * Express middleware that verifies a preference row belongs to the
 * authenticated user for the given resource before it can be deleted.
 * Prevents deleting another user's preference or a shared system default
 * (userId = -1) via id guessing, then builds req.body.rows for antity-pgsql's
 * generic delete middleware.
 *
 * @param {import('express').Request} req
 * @param {Object} req.params
 * @param {string} req.params.resource - Table/component identifier from URL
 * @param {string} req.params.id - Preference id from URL
 * @param {import('express').Response} res
 * @param {number} res.locals.consumer.userId - Authenticated user ID
 * @param {import('express').NextFunction} next
 */
export default async function checkPreferenceOwnership(req, res, next) {
  const userId = res.locals.consumer.userId;
  const { resource, id } = req.params;

  if (!isNumber(id, false)) {
    return next({ statusCode: 400, message: "Invalid preference id" });
  }
  const preferenceId = Number(id);

  log.debug(
    () =>
      `checkPreferenceOwnership(userId=${userId}, resource=${resource}, id=${preferenceId})`,
  );

  try {
    const { rows } = await execute(
      `SELECT id FROM preference WHERE id = $1 AND "userId" = $2 AND resource = $3`,
      [preferenceId, userId, String(resource)],
      null,
    );
    if (rows.length === 0) {
      return next({ statusCode: 404, message: "Preference not found" });
    }
  } catch (err) {
    return next(err);
  }

  req.body = { rows: [{ id: preferenceId }] };
  next();
}
