import { log } from "@dwtechs/winstan";
const VerbsWithBody = ["post", "put", "patch"];
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
  const init = { method, headers: { "Content-Type": "application/json", ...headers } };

  if (VerbsWithBody.includes(method) && data)
    init.body = JSON.stringify(data);

  return fetch(fullUrl, init)
    .then(async (res) => {
      const responseData = await res.json().catch(() => null);
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.status = res.status;
        err.msg = `HTTP(${res.status}): ${res.statusText}`;
        throw err;
      }
      const result = { status: res.status, data: responseData };
      logEnd(result, time);
      return result;
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 503;
        err.msg = `HTTP(503): ${err.message}`;
      }
      throw err;
    });
}

/**
 * Logs the start of an HTTP query.
 */
function logStart(method, url, params, data, headers) {
  const p = JSON.stringify(params) || null;
  const d = JSON.stringify(data) || null;
  const h = JSON.stringify(headers) || null;
  log.debug(`${LOG_PREFIX} query : { method: '${method}', Url: '${url}', params: '${p}', data: '${d}', headers: '${h}'}`);
  return Date.now();
}

/**
 * Logs the end of an HTTP query.
 */
function logEnd(res, time) {
  const delta = Date.now() - time;
  const data = JSON.stringify(res.data);
  log.debug(`${LOG_PREFIX} response in ${delta}ms. status: ${res.status}, data: ${data}`);
}

export default {
  query,
};

