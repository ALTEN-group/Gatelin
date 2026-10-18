// @ts-check

const COOKIE_NAME_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const COOKIE_NAME_MAX = 64;
const COOKIES_MAX = 20;

/**
 * Throws unless `v` is an array of valid, unique cookie names (RFC 6265 tokens).
 * @param {unknown} v
 */
export function validateCookieNames(v) {
  if (!Array.isArray(v)) throw new Error("must be an array");
  if (v.length > COOKIES_MAX)
    throw new Error(`must contain at most ${COOKIES_MAX} cookie names`);
  for (const name of v) {
    if (
      typeof name !== "string" ||
      name.length > COOKIE_NAME_MAX ||
      !COOKIE_NAME_RE.test(name)
    )
      throw new Error(`invalid cookie name ${JSON.stringify(name)}`);
  }
  if (new Set(v).size !== v.length) throw new Error("duplicate cookie name");
}
