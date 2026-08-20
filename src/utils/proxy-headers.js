// @ts-check

import routeSvc from "../services/route.js";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

// The JWT and CSRF token authenticate to Gatelin, not to arbitrary
// upstream services. Cookies stay private for the same reason; services should
// use the trusted x-consumer-* headers injected below.
export const PRIVATE_REQUEST_HEADERS = new Set([
  "authorization",
  "cookie",
  "x-csrf-token",
]);

/**
 * @param {string|string[]|undefined} value
 * @returns {string}
 */
export function headerValue(value) {
  if (Array.isArray(value)) return value.join(",");
  return value ?? "";
}

/**
 * @param {import('node:http').IncomingHttpHeaders} source
 * @param {{ extraBlocked?: Set<string>, keep?: string[] }} [opts]
 * @returns {import('node:http').OutgoingHttpHeaders}
 */
export function copyHeaders(source, opts = {}) {
  const extraBlocked = opts.extraBlocked ?? new Set();
  const keep = new Set((opts.keep ?? []).map((name) => name.toLowerCase()));
  const blocked = new Set([...HOP_BY_HOP_HEADERS, ...extraBlocked]);
  for (const name of keep) blocked.delete(name);

  const connection = source.connection;
  if (typeof connection === "string") {
    for (const name of connection.split(",")) {
      const hop = name.trim().toLowerCase();
      if (!keep.has(hop)) blocked.add(hop);
    }
  }

  /** @type {import('node:http').OutgoingHttpHeaders} */
  const headers = {};
  for (const [name, value] of Object.entries(source)) {
    if (value !== undefined && !blocked.has(name.toLowerCase()))
      headers[name] = value;
  }
  return headers;
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').IncomingMessage} [upstreamRes]
 * @returns {boolean}
 */
export function isEventStream(req, upstreamRes) {
  const accept = headerValue(req.headers.accept).toLowerCase();
  if (accept.includes("text/event-stream")) return true;
  const contentType = headerValue(
    upstreamRes?.headers?.["content-type"],
  ).toLowerCase();
  return contentType.includes("text/event-stream");
}

/**
 * @param {string} serviceName
 * @param {string} reqUrl
 * @returns {URL}
 */
export function resolveUpstreamUrl(serviceName, reqUrl) {
  const parsed = new URL(reqUrl, "http://placeholder");
  const safeRoute = `${parsed.pathname}${parsed.search}`;
  return new URL(`${routeSvc.getServiceBaseUrl(serviceName)}${safeRoute}`);
}

export function upstreamTimeoutMs() {
  return Number(process.env.UPSTREAM_TIMEOUT_MS) || 30000;
}
