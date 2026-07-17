/**
 * Builds a unique "<name> (copy[ N])" name to fork a template's conf into a
 * personal, distinctly-named view, avoiding collisions with the user's
 * existing preference names for the same resource.
 * @param {string} name
 * @param {Set<string>} takenNames
 * @returns {string}
 */
function uniqueCopyName(name, takenNames) {
  let candidate = `${name} (copy)`;
  let n = 2;
  while (takenNames.has(candidate)) {
    candidate = `${name} (copy ${n})`;
    n++;
  }
  return candidate;
}

// @ts-check

/**
 * Express middleware run after pEnt.get: fails with 403 if the preference is locked.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Array<object>} res.locals.rows
 * @param {import('express').NextFunction} next
 */
export function renameIfLocked(req, res, next) {
  if (res.locals.rows[0].locked)
    // weed need to insert a copy

    next();
}
