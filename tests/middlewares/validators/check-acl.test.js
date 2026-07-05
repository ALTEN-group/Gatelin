/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const roleSvcPath = path.join(__dirname, "../../../src/services/role.js");
const scopeSvcPath = path.join(__dirname, "../../../src/services/scope.js");

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}));
jest.unstable_mockModule(roleSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn() },
}));
jest.unstable_mockModule(scopeSvcPath, () => ({
  __esModule: true,
  default: { getValues: jest.fn((ids) => ids), init: jest.fn() },
}));

describe("checkAcl middleware", () => {
  let checkAcl;
  let log;
  let roleService;
  let req, res, next;

  beforeAll(async () => {
    const winstanModule = await import("@dwtechs/winstan");
    log = winstanModule.log;
    const roleModule = await import("../../../src/services/role.js");
    roleService = roleModule.default;
    const module = await import(
      "../../../src/middlewares/validators/check-acl.js"
    );
    checkAcl = module.default;
  });

  const debugMessages = () =>
    log.debug.mock.calls.map(([arg]) =>
      typeof arg === "function" ? arg() : arg,
    );

  beforeEach(() => {
    req = { originalUrl: "/api/test" };
    res = {
      locals: {
        route: { protected: true, id: 10, operationId: [2], url: "/api/test" },
        consumer: { id: "c1", roles: [1, 2] },
      },
    };
    next = jest.fn();
  });

  it("should call next() immediately for an unprotected route", () => {
    res.locals.route.protected = false;

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(roleService.getOne).not.toHaveBeenCalled();
  });

  it("should call next() when a consumer role has the required permission", () => {
    roleService.getOne.mockImplementation((id) => ({
      id,
      name: `role-${id}`,
      permissions:
        id === 1 ? new Map([[10, { route: 10, operations: [2] }]]) : new Map(),
    }));

    checkAcl(req, res, next);

    expect(debugMessages()).toContain(
      "checkAcl(consumer: c1, operations: 2, route: /api/test",
    );
    expect(next).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 }),
    );
  });

  it("should call next(403) when no role has the required permission", () => {
    roleService.getOne.mockReturnValue({
      name: "viewer",
      permissions: new Map([[99, { route: 99, operations: [5] }]]),
    });

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Forbidden",
    });
  });

  it("should call next(403) when consumer has no roles", () => {
    res.locals.consumer.roles = [];

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Forbidden",
    });
    expect(roleService.getOne).not.toHaveBeenCalled();
  });

  it("should check all consumer roles before denying access", () => {
    // First role has no permission, second role has the required permission
    roleService.getOne.mockImplementation((id) => ({
      name: `role-${id}`,
      permissions:
        id === 2 ? new Map([[10, { route: 10, operations: [2] }]]) : new Map(),
    }));

    checkAcl(req, res, next);

    expect(roleService.getOne).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith();
  });

  it("should deny when operation does not match even if route matches", () => {
    roleService.getOne.mockReturnValue({
      name: "viewer",
      permissions: new Map([[10, { route: 10, operations: [99] }]]), // route matches, operation does not
    });

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Forbidden",
    });
  });

  it("should allow when perm.scopes contains a keyword present in the URL path", () => {
    req.originalUrl = "/gateway/preferences/routes";
    res.locals.route.resourceName = "preferences";
    roleService.getOne.mockImplementation((id) => ({
      id,
      name: `role-${id}`,
      permissions:
        id === 1
          ? new Map([
              [
                10,
                { route: 10, operations: [2], scopes: ["routes", "consumers"] },
              ],
            ])
          : new Map(),
    }));

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should allow when perm.scopes keyword appears before the route name in the URL path", () => {
    req.originalUrl = "/gateway/routes/preferences";
    res.locals.route.resourceName = "gateway";
    roleService.getOne.mockImplementation((id) => ({
      id,
      name: `role-${id}`,
      permissions:
        id === 1
          ? new Map([
              [
                10,
                { route: 10, operations: [2], scopes: ["routes", "consumers"] },
              ],
            ])
          : new Map(),
    }));

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should deny when perm.scopes is defined but no URL segment matches", () => {
    req.originalUrl = "/gateway/preferences/services";
    res.locals.route.resourceName = "preferences";
    roleService.getOne.mockImplementation((id) => ({
      id,
      name: `role-${id}`,
      permissions: new Map([
        [10, { route: 10, operations: [2], scopes: ["routes", "consumers"] }],
      ]),
    }));

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Forbidden",
    });
  });

  it("should allow when no perm.scopes restriction is set regardless of URL", () => {
    req.originalUrl = "/gateway/scopes/search";
    roleService.getOne.mockImplementation((id) => ({
      id,
      name: `role-${id}`,
      permissions:
        id === 1 ? new Map([[10, { route: 10, operations: [2] }]]) : new Map(),
    }));

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
