// @ts-check
import { log } from "@dwtechs/winstan";
import roleSvc from "../../services/role.js";
import routeSvc from "../../services/route.js";
import scopeSvc from "../../services/scope.js";

/**
 * Builds middleware that rebuilds in-memory caches from the database after a
 * successful mutation.
 *
 * The route and role caches hold derived state (compiled regexes, service base
 * URLs, permission maps keyed by routeId) that cannot be patched incrementally
 * from a single changed row, so the whole cache is reloaded instead.
 *
 * A reload failure leaves Gatelin serving stale authorization data, so it
 * is surfaced as a 500 rather than swallowed — the write itself already
 * committed, and the operator needs to know the cache diverged.
 *
 * @param {string} label - Cache name used in error messages and logs
 * @param {...{ init: () => Promise<void> }} svcs - Services to reinitialize
 * @return {import('express').RequestHandler}
 */
export function reloadCache(label, ...svcs) {
  return (_req, _res, next) => {
    Promise.all(svcs.map((svc) => svc.init()))
      .then(() => {
        log.debug(() => `Reloaded ${label} cache`);
        next();
      })
      .catch((err) => {
        log.error(`Failed to reload ${label} cache: ${err.message}`);
        next({
          statusCode: 500,
          message: `Changes were saved but the ${label} cache could not be reloaded`,
        });
      });
  };
}

/** Route patterns, per-method buckets and service base URLs. */
export const reloadRoutes = reloadCache("route", routeSvc);

/** Roles and their indexed permissions (fields, conditions, scopes). */
export const reloadRoles = reloadCache("role", roleSvc);

/** Scope names, plus the role permissions that reference them. */
export const reloadScopes = reloadCache("scope", scopeSvc, roleSvc);
