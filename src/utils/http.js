import { log } from "@dwtechs/winstan";

const VerbsWithBody = new Set(["post", "put", "patch"]);
const LOG_PREFIX = "HTTP ";
const UPSTREAM_TIMEOUT_MS = Number(process.env.UPSTREAM_TIMEOUT_MS) || 30000;
const JSON_CONTENT_TYPE = "application/json";
const FORM_CONTENT_TYPE = "application/x-www-form-urlencoded";

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
 * @param {unknown} value
 * @return {string|null}
 */
function redact(value) {
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

/**
 * @param {string|undefined} contentType
 * @returns {string}
 */
function mediaType(contentType) {
  return (contentType ?? "").split(";")[0].trim().toLowerCase();
}

/**
 * @param {Record<string, unknown>} data
 * @returns {string}
 */
function toUrlEncoded(data) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value))
      for (const item of value) params.append(key, String(item));
    else params.append(key, String(value));
  }
  return params.toString();
}

/**
 * @param {unknown} data
 * @param {string} contentType
 * @returns {string|undefined}
 */
function serializeBody(data, contentType) {
  if (data === undefined || data === null) return undefined;
  if (mediaType(contentType) === FORM_CONTENT_TYPE) {
    if (typeof data !== "object" || Array.isArray(data)) return String(data);
    return toUrlEncoded(/** @type {Record<string, unknown>} */ (data));
  }
  return JSON.stringify(data);
}

/**
 * Sends a request to the specified URL using the specified HTTP verb.
 *
 * @param {string} verb - The HTTP verb to use for the request.
 * @param {string} url - The URL to send the request to.
 * @param {Object} [params] - The query parameters to include in the request.
 * @param {Object} [data] - The request body data for POST, PUT, PATCH methods.
 * @param {Object} [headers] - The headers to include in the request.
 *   Pass `Content-Type: application/x-www-form-urlencoded` to re-encode
 *   HTML form bodies; otherwise the body is JSON-encoded (default).
 * @return {Promise<Object>} A promise that resolves to an object with status and data properties.
 * @throws {Error} If the request fails with a status code other than 2xx.
 */
function query(verb, url, params, data, headers) {
  const method = verb.toLowerCase();
  const time = logStart(method, url, params, data, headers);

  const fullUrl = params ? `${url}?${new URLSearchParams(params)}` : url;
  const contentType =
    headers?.["Content-Type"] ?? headers?.["content-type"] ?? JSON_CONTENT_TYPE;
  const init = {
    method,
    headers: { "Content-Type": contentType, ...headers },
    // Without this an unresponsive upstream holds the socket and its event-loop
    // work until the client gives up, which exhausts the gateway under load.
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  };

  if (VerbsWithBody.has(method) && data)
    init.body = serializeBody(data, contentType);

  return fetch(fullUrl, init)
    .then(async (res) => {
      // Server-rendered workflow pages (password recovery, 2FA…) answer with
      // HTML, so parsing every upstream body as JSON would drop them. An
      // unknown content type keeps the original JSON-first behaviour.
      const responseContentType = res.headers?.get?.("content-type") ?? "";
      const isJson =
        !responseContentType || responseContentType.includes("json");
      const responseData =
        res.status === 204
          ? null
          : isJson
            ? await res.json().catch(() => null)
            : await res.text().catch(() => null);
      if (!res.ok) {
        // Rich context (`HTTP(<code>): <statusText>`) goes into `err.message`,
        // not a parallel `err.msg` field. `@dwtechs/errandler-express`'s
        // clientErrorHandler reads `err.message` for the response body and
        // ignores every other name — so this is the ONLY field that reaches
        // the client. See tests/contracts/errandler-express-error-shape.test.js
        // for the wire contract.
        const err = new Error(`HTTP(${res.status}): ${res.statusText}`);
        err.statusCode = res.status;
        throw err;
      }
      const result = { status: res.status, data: responseData };
      if (responseContentType) result.contentType = responseContentType;
      logEnd(result, time);
      return result;
    })
    .catch((err) => {
      // Network failure / non-HTTP error path (ECONNREFUSED, DNS, TLS, etc.).
      // The `!err.statusCode` guard prevents double-wrapping the HTTP-error
      // path above, which has already populated statusCode on the same object.
      // 503 (Service Unavailable) is the RFC-correct signal for "upstream
      // unreachable" and is what forward.js's default falls back to.
      if (!err.statusCode) {
        // AbortSignal.timeout() rejects with TimeoutError; AbortError covers
        // an explicit abort. Both mean the upstream never answered in time.
        const timedOut =
          err.name === "TimeoutError" || err.name === "AbortError";
        // err.message is the only field that reaches the client, so the raw
        // cause is kept in the server log and replaced with a generic string.
        log.error(
          `${LOG_PREFIX}${method} ${url} failed: ${err.name}: ${err.message}`,
        );
        err.statusCode = timedOut ? 504 : 503;
        err.message = timedOut
          ? "HTTP(504): Upstream timeout"
          : "HTTP(503): Service Unavailable";
      }
      throw err;
    });
}

/**
 * Logs the start of an HTTP query.
 */
function logStart(method, url, params, data, headers) {
  log.debug(() => {
    const p = redact(params);
    const d = redact(data);
    const headerKeys = headers ? Object.keys(headers).join(", ") : null;
    return `${LOG_PREFIX} query : { method: '${method}', Url: '${url}', params: '${p}', data: '${d}', headers: [${headerKeys}]}`;
  });
  return Date.now();
}

/**
 * Logs the end of an HTTP query.
 */
function logEnd(res, time) {
  log.debug(() => {
    const delta = Date.now() - time;
    const data = redact(res.data);
    return `${LOG_PREFIX} response in ${delta}ms. status: ${res.status}, data: ${data}`;
  });
}

export default {
  query,
};
