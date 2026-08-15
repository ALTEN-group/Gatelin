/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../../src/services/route.js");
const roleSvcPath = path.join(__dirname, "../../../src/services/role.js");
const scopeSvcPath = path.join(__dirname, "../../../src/services/scope.js");

const log = { debug: jest.fn(), info: jest.fn(), error: jest.fn() };
jest.unstable_mockModule("@dwtechs/winstan", () => ({ log }));

const routeInit = jest.fn();
const roleInit = jest.fn();
const scopeInit = jest.fn();
jest.unstable_mockModule(routeSvcPath, () => ({
  __esModule: true,
  default: { init: routeInit },
}));
jest.unstable_mockModule(roleSvcPath, () => ({
  __esModule: true,
  default: { init: roleInit },
}));
jest.unstable_mockModule(scopeSvcPath, () => ({
  __esModule: true,
  default: { init: scopeInit },
}));

describe("cache reload middleware", () => {
  let reloadCache;
  let reloadRoutes;
  let reloadScopes;
  let next;

  beforeAll(async () => {
    const module = await import("../../../src/middlewares/cache/reload.js");
    reloadCache = module.reloadCache;
    reloadRoutes = module.reloadRoutes;
    reloadScopes = module.reloadScopes;
  });

  beforeEach(() => {
    routeInit.mockResolvedValue(undefined);
    roleInit.mockResolvedValue(undefined);
    scopeInit.mockResolvedValue(undefined);
    next = jest.fn();
  });

  it("should reinitialize the service and continue the chain", async () => {
    const svc = { init: jest.fn().mockResolvedValue(undefined) };

    await new Promise((resolve) => {
      reloadCache("widget", svc)({}, {}, (...args) => {
        next(...args);
        resolve();
      });
    });

    expect(svc.init).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should surface a reload failure as a 500 rather than serve stale rules", async () => {
    const svc = { init: jest.fn().mockRejectedValue(new Error("db down")) };

    await new Promise((resolve) => {
      reloadCache("widget", svc)({}, {}, (...args) => {
        next(...args);
        resolve();
      });
    });

    // The write already committed, so silence here would leave the gateway
    // enforcing the previous authorization rules with no signal.
    expect(next).toHaveBeenCalledWith({
      statusCode: 500,
      message: expect.stringContaining("widget"),
    });
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining("db down"));
  });

  it("should reload the route cache after a route mutation", async () => {
    await new Promise((resolve) => {
      reloadRoutes({}, {}, resolve);
    });

    expect(routeInit).toHaveBeenCalledTimes(1);
  });

  it("should reload both scope and role caches when scopes change", async () => {
    // Permissions reference scopes by id, so the role cache has to be rebuilt
    // alongside the scope cache or ACL checks resolve stale names.
    await new Promise((resolve) => {
      reloadScopes({}, {}, resolve);
    });

    expect(scopeInit).toHaveBeenCalledTimes(1);
    expect(roleInit).toHaveBeenCalledTimes(1);
  });
});
