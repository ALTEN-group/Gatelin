// @ts-check

import routeSvc from "../services/route.js";
import { resolvedPathAndQuery } from "./url.js";

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
 * Builds the `Cookie` header a service is entitled to: only the cookies it
 * registered for, never Gatelin's own session cookies.
 *
 * @param {string|string[]|undefined} cookieHeader - Incoming `Cookie` header
 * @param {string[]|null|undefined} allowed - Cookie names registered on the service
 * @returns {string|undefined} Filtered header, or undefined when nothing is forwarded
 */
export function upstreamCookies(cookieHeader, allowed) {
  if (!cookieHeader || !allowed?.length) return undefined;
  const reserved = new Set([
    process.env.CSRF_COOKIE_NAME || "csrfToken",
    process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken",
  ]);
  const names = new Set(allowed.filter((name) => !reserved.has(name)));
  const kept = headerValue(cookieHeader)
    .split(";")
    .map((pair) => pair.trim())
    .filter((pair) => {
      const eq = pair.indexOf("=");
      return eq > 0 && names.has(pair.slice(0, eq));
    });
  return kept.length ? kept.join("; ") : undefined;
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
  const safeRoute = resolvedPathAndQuery(reqUrl);
  return new URL(`${routeSvc.getServiceBaseUrl(serviceName)}${safeRoute}`);
}

export function upstreamTimeoutMs() {
  return Number(process.env.UPSTREAM_TIMEOUT_MS) || 30000;
}
