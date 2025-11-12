import axios from "axios";
import { log } from "@dwtechs/winstan";
const VerbsWithBody = ["post", "put", "patch"];
const LOG_PREFIX = "Axios ";

/**
 * Sends a request to the specified URL using the specified HTTP verb.
 *
 * @param {string} verb - The HTTP verb to use for the request.
 * @param {string} url - The URL to send the request to.
 * @param {Object} [params] - The query parameters to include in the request.
 * @param {Object} [data] - The request body data for POST, PUT, PATCH methods.
 * @param {Object} [headers] - The headers to include in the request.
 * @return {Promise<Object>} A promise that resolves to the axios response object.
 * @throws {Error} If the request fails with a status code other than 2xx.
 * @example
 * // GET request with query parameters
 * const response = await query('GET', 'https://api.example.com/users', { page: 1 });
 * 
 * // POST request with data
 * const response = await query('POST', 'https://api.example.com/users', null, { name: 'John' });
 * 
 * // Request with custom headers
 * const response = await query('GET', 'https://api.example.com/users', null, null, { Authorization: 'Bearer token' });
 */
function query(verb, url, params, data, headers) {
  const method = verb.toLowerCase();
  const time = logStart(method, url, params, data, headers);
  const conf = { method, url, headers };
  
  if (VerbsWithBody.includes(method) && data)
    conf.data = data ;
  else if (params)
    conf.params = params; 

  return axios(conf).then((res) => {
      logEnd(res, time);
      return res;
    })
    .catch((err) => {
      err.status = err.response?.status || 503;
      err.msg = `Axios(${err.status}): ${err.cause}`;
      throw err;
    });
}

/**
 * Logs the start of an Axios query.
 *
 * @param {string} verb - The HTTP verb for the query.
 * @param {string} url - The URL for the query.
 * @param {Object} [data] - The body for the query.
 * @param {Object} [headers] - The headers for the query.
 * @return {number} The current timestamp.
 */
function logStart(method, url, params, data, headers) {
  const p = JSON.stringify(params) || null;
  const d = JSON.stringify(data) || null;
  const h = JSON.stringify(headers) || null;
  log.debug(`${LOG_PREFIX} query : { method: '${method}', Url: '${url}', params: '${p}', data: '${d}', headers: '${h}'}`);
  return Date.now();
}

/**
 * Logs the end of an Axios query.
 *
 * @param {Object} res - The response object from the Axios query.
 * @param {number} time - The timestamp when the query started.
 * @return {void}
 */
function logEnd(res, time) {
  const delta = Date.now() - time;
  const data = JSON.stringify(res.data);
  log.debug(`${LOG_PREFIX} response in ${delta}ms. status: ${res.status}, data: ${data}`);
}

export default {
  query,
};
