// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import { isArray, isValidInteger } from "@dwtechs/checkard";

/**
 * Fail-closed pre-flight for PUT /preferences/:resource.
 *
 * Verifies that every row in `req.body.rows` (identified by its `id`) belongs to
 * the URL's `:resource` AND is either:
 *   - owned by the authenticated consumer (`userId = res.locals.consumer.userId`), or
 *   - a locked system template (`userId IS NULL`).
 *
 * Templates are allowed because the table-views grid re-sends every view (templates
 * included) whenever the active one changes. This is safe: `iud_preference` never
 * mutates a template. Selecting one only records the caller's choice, and an edited
 * `name`/`conf` forks a personal copy instead.
 *
 * Runs one bounded `SELECT ... WHERE id = ANY(...)` and compares the returned row
 * count to the number of distinct ids requested. If any id fails a predicate (another
 * user's personal row, another resource, unknown id), the count mismatches and the
 * whole batch is rejected with 403: no partial updates, no per-row disclosure.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
export async function assertRowsOwnedOrTemplate(req, res, next) {
  const rows = req.body?.rows;
  if (!isArray(rows, ">", 0))
    return next({ statusCode: 400, message: "Missing rows in req.body" });

  const ids = rows
    .map((r) => r?.id)
    .filter((v) => isValidInteger(v, 1, undefined, true));
  if (ids.length !== rows.length)
    return next({
      statusCode: 400,
      message: "Every row must carry a valid integer id",
    });

  const userId = res.locals.consumer.userId;
  const { resource } = req.params;
  const distinctIds = [...new Set(ids)];

  try {
    const r = await execute(
      `SELECT id FROM preferences
       WHERE id = ANY($1::int[])
         AND "resourceName" = $2
         AND ("userId" = $3 OR "userId" IS NULL)`,
      [distinctIds, resource, userId],
      null,
    );
    if ((r.rows?.length ?? 0) !== distinctIds.length)
      return next({
        statusCode: 403,
        message:
          "One or more rows belong to another user or fall outside the resource scope",
      });
    next();
  } catch (err) {
    next(err);
  }
}
