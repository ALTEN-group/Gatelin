// @ts-check

import safeRegex from "safe-regex2";

/**
 * Write-time ReDoS guard for route `pattern` fields.
 *
 * Uses [safe-regex2](https://github.com/fastify/safe-regex2) (star-height /
 * repetition-limit analysis via `ret`) instead of a hand-rolled heuristic.
 * That catches nested quantifiers and high bounded-repetition counts, but is
 * still best-effort: some alternation-heavy or backreference-based patterns
 * (e.g. `(a|a)+`, `(a+)\1+`) may still be accepted. Route CRUD is admin-only;
 * do not treat this check as complete ReDoS protection.
 *
 * Examples rejected:  (a+)+   (a*)*   ([a-z]+)+   (a+){10}
 * Examples allowed:   /\d+    /search  /(?<id>\d+)/history
 */

/**
 * Express middleware that validates route `pattern` fields in req.body.rows
 * against known ReDoS-prone structures before they are written to the database.
 * Applied to both POST (insert) and PUT (update) on the /gateway/routes endpoint.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function checkRoutePattern(req, _res, next) {
  const rows = req.body?.rows;
  if (!Array.isArray(rows)) return next();

  for (const row of rows) {
    const pattern = row.pattern;
    if (typeof pattern !== "string") continue;

    // Compile first so invalid syntax gets a clear error (safe-regex2 also
    // returns false for unparsable patterns, which would mislabel them as ReDoS).
    // The compiled RegExp is intentionally discarded — this call exists purely
    // to surface syntax errors before safe-regex2 runs. The pattern is then
    // checked for ReDoS below, and the endpoint is admin-only, so this is not
    // a regex-injection sink.
    // codeql[js/regex-injection]
    try {
      new RegExp(pattern);
    } catch {
      return next({
        statusCode: 400,
        message: `Route pattern "${pattern}" is not a valid regular expression.`,
      });
    }

    if (!safeRegex(pattern)) {
      return next({
        statusCode: 400,
        message: `Route pattern "${pattern}" may cause catastrophic backtracking (ReDoS).`,
      });
    }
  }

  next();
}
