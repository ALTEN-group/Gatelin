import { log } from "@dwtechs/winstan";

const VerbsWithBody = new Set(["post", "put", "patch"]);
const LOG_PREFIX = "HTTP ";

/**
 * Sends a request to the specified URL using the specified HTTP verb.
 *
 * @param {string} verb - The HTTP verb to use for the request.
 * @param {string} url - The URL to send the request to.
 * @param {Object} [params] - The query parameters to include in the request.
 * @param {Object} [data] - The request body data for POST, PUT, PATCH methods.
 * @param {Object} [headers] - The headers to include in the request.
 * @return {Promise<Object>} A promise that resolves to an object with status and data properties.
 * @throws {Error} If the request fails with a status code other than 2xx.
 */
function query(verb, url, params, data, headers) {
  const method = verb.toLowerCase();
  const time = logStart(method, url, params, data, headers);

  const fullUrl = params ? `${url}?${new URLSearchParams(params)}` : url;
  const init = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };

  if (VerbsWithBody.has(method) && data) init.body = JSON.stringify(data);

  return fetch(fullUrl, init)
    .then(async (res) => {
      const responseData =
        res.status !== 204 ? await res.json().catch(() => null) : null;
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
        err.statusCode = 503;
        err.message = `HTTP(503): ${err.message}`;
      }
      throw err;
    });
}

/**
 * Logs the start of an HTTP query.
 */
function logStart(method, url, params, data, headers) {
  log.debug(() => {
    const p = JSON.stringify(params) || null;
    const d = JSON.stringify(data) || null;
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
    const data = JSON.stringify(res.data);
    return `${LOG_PREFIX} response in ${delta}ms. status: ${res.status}, data: ${data}`;
  });
}

export default {
  query,
};
