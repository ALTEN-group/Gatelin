// @ts-check
import { randomBytes } from "node:crypto";

const CSRF_COOKIE_NAME = process.env.CSRF_COOKIE_NAME || "csrfToken";
const SAME_SITE_VALUES = ["strict", "lax", "none"];
const requestedSameSite = (
  process.env.REFRESH_TOKEN_COOKIE_SAMESITE || ""
).toLowerCase();
const sameSite = SAME_SITE_VALUES.includes(requestedSameSite)
  ? requestedSameSite
  : "strict";
const secure = process.env.REFRESH_TOKEN_COOKIE_HTTPS_ONLY !== "false";

// Browsers only overwrite or delete a cookie when path, secure and sameSite
// match the ones it was set with, so both handlers must use the same options.
const COOKIE_OPTIONS = {
  httpOnly: false,
  secure,
  sameSite,
  path: "/",
};

/**
 * Issues a fresh CSRF cookie (double-submit pattern).
 * Not httpOnly: the client must be able to read it and echo it back
 * in the X-CSRF-Token header on state-changing session requests.
 */
export function setCsrfCookie(_req, res, next) {
  const token = randomBytes(32).toString("hex");
  res.cookie(CSRF_COOKIE_NAME, token, COOKIE_OPTIONS);
  next();
}

export function clearCsrfCookie(_req, res, next) {
  res.clearCookie(CSRF_COOKIE_NAME, COOKIE_OPTIONS);
  next();
}
