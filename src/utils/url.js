// @ts-check

const TRAILING_SLASH_RE = /\/$/;
const REQUEST_URL_BASE = "http://placeholder";

/**
 * Removes trailing slash from a URL string if present.
 * This ensures consistent URL matching by normalizing URLs with and without trailing slashes.
 * Uses regex pattern /\/$/ which matches a forward slash (\/) at the end of string ($).
 *
 * @param {string} url - The URL string to process
 * @return {string} The URL without a trailing slash
 * @example
 * stripTrailingSlash('/api/users/') // returns '/api/users'
 * stripTrailingSlash('/api/users')  // returns '/api/users'
 */
export function stripTrailingSlash(url) {
  return url.replace(TRAILING_SLASH_RE, "");
}

/**
 * Parse a request path (optionally with query) the same way the proxy does
 * before forwarding, so route matching and upstream see one resolved URL.
 *
 * @param {string} requestUrl
 * @returns {URL}
 */
export function parseRequestUrl(requestUrl) {
  return new URL(requestUrl, REQUEST_URL_BASE);
}

/**
 * Pathname after WHATWG dot-segment resolution, query omitted, trailing slash
 * stripped. Returns null when `requestUrl` is not a valid URL path.
 *
 * @param {string} requestUrl
 * @returns {string|null}
 */
export function resolvedPathname(requestUrl) {
  try {
    return stripTrailingSlash(parseRequestUrl(requestUrl).pathname);
  } catch {
    return null;
  }
}

/**
 * Pathname + query after WHATWG resolution. Host from a protocol-relative
 * path (`//evil/...`) is dropped; only the resolved path is forwarded onto
 * the configured service base URL.
 *
 * @param {string} requestUrl
 * @returns {string}
 */
export function resolvedPathAndQuery(requestUrl) {
  const parsed = parseRequestUrl(requestUrl);
  return `${parsed.pathname}${parsed.search}`;
}
