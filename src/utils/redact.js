// @ts-check

/** Keys whose values must never reach a log sink, matched case-insensitively. */
const SENSITIVE_KEYS = new Set([
  "accesstoken",
  "authorization",
  "cookie",
  "csrftoken",
  "idtoken",
  "newpwd",
  "oldpwd",
  "password",
  "pwd",
  "refreshtoken",
  "secret",
  "set-cookie",
  "token",
  "x-csrf-token",
]);

const MASK = "[REDACTED]";

/**
 * Serializes a value for logging with sensitive fields masked.
 *
 * Log aggregators retain debug output far longer than a request lives, so
 * credentials that transit the gateway must never be written verbatim.
 *
 * @param {unknown} value - The value to serialize
 * @return {string|null} JSON string with sensitive values masked, or null
 */
export function redact(value) {
  if (value === undefined || value === null) return null;
  const seen = new WeakSet();
  return JSON.stringify(value, function replacer(key, val) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) return MASK;
    if (typeof val === "object" && val !== null) {
      if (seen.has(val)) return "[Circular]";
      seen.add(val);
    }
    return val;
  });
}
