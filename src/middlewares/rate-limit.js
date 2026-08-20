// @ts-check

import { isInteger } from "@dwtechs/checkard";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const SESSION_WINDOW_MS = 15 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

/**
 * @param {string} name
 * @param {number} fallback
 * @returns {number}
 */
export function envMax(name, fallback) {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Login stays on IP. Authenticated hops key by consumer so a stolen JWT is
 * capped even when many users share a NAT address.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {string}
 */
export function identityKey(req, res) {
  const id = res.locals.consumer?.id;
  if (isInteger(id)) return `c:${id}`;
  return ipKeyGenerator(req.ip ?? req.socket?.remoteAddress ?? "127.0.0.1");
}

/**
 * @param {number} max
 * @returns {import('express').RequestHandler}
 */
export function createIdentityLimiter(max) {
  return rateLimit({
    windowMs: MINUTE_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: identityKey,
    handler: (_req, _res, next) => {
      next({ statusCode: 429, message: "HTTP(429): Too Many Requests" });
    },
  });
}

/**
 * Login stuffing is per client IP. Do not key on consumer — there is none
 * until after a successful login.
 *
 * @param {number} max
 * @returns {import('express').RequestHandler}
 */
export function createSessionLimiter(max) {
  return rateLimit({
    windowMs: SESSION_WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next({ statusCode: 429, message: "HTTP(429): Too Many Requests" });
    },
  });
}

export const sessionLimiter = createSessionLimiter(
  envMax("SESSION_RATE_LIMIT_MAX", 20),
);

export const adminLimiter = createIdentityLimiter(
  envMax("ADMIN_RATE_LIMIT_MAX", 300),
);
export const proxyLimiter = createIdentityLimiter(
  envMax("PROXY_RATE_LIMIT_MAX", 200),
);
