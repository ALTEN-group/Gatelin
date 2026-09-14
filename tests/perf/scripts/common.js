// Shared config/helpers for Gatelin k6 scenarios.
import http from "k6/http";
import { check } from "k6";

const host = __ENV.K6_TARGET_HOST || "localhost";
const port = __ENV.K6_TARGET_PORT || "80";
const basePath = __ENV.K6_BASE_PATH || "/api";

export const BASE_URL = `http://${host}:${port}${basePath}/gatelin`;

export const CREDENTIALS = {
  email: __ENV.K6_EMAIL || "admin@example.com",
  pwd: __ENV.K6_PWD || "",
};

/**
 * Logs in and returns the bearer access token for subsequent authenticated calls.
 * @returns {string} accessToken
 * @throws {Error} when login does not return a 200 with an accessToken
 */
export function login() {
  const res = http.post(`${BASE_URL}/sessions`, JSON.stringify(CREDENTIALS), {
    headers: { "Content-Type": "application/json" },
    tags: { name: "login" },
  });
  check(res, { "login: status 200": (r) => r.status === 200 });
  const accessToken = res.json("accessToken");
  if (!accessToken) {
    throw new Error(`login failed: status=${res.status} body=${res.body}`);
  }
  return accessToken;
}

/**
 * Builds the standard authenticated request headers.
 * @param {string} accessToken - bearer access token returned by login()
 * @returns {object} params object for k6 http calls
 */
export function authHeaders(accessToken) {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
}
