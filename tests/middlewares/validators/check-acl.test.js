/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

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
    req.originalUrl = "/gatelin/preferences/routes";
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
    req.originalUrl = "/gatelin/routes/preferences";
    res.locals.route.resourceName = "gatelin";
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
    req.originalUrl = "/gatelin/preferences/services";
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
    req.originalUrl = "/gatelin/scopes/search";
    roleService.getOne.mockImplementation((id) => ({
      id,
      name: `role-${id}`,
      permissions:
        id === 1 ? new Map([[10, { route: 10, operations: [2] }]]) : new Map(),
    }));

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should set req.aclConditions when the matched permission has conditions", () => {
    const conditions = [{ field: "archived", op: "=", value: false }];
    roleService.getOne.mockReturnValue({
      name: "viewer",
      permissions: new Map([[10, { route: 10, operations: [2], conditions }]]),
    });

    checkAcl(req, res, next);

    expect(req.aclConditions).toBe(conditions);
    expect(next).toHaveBeenCalledWith();
  });

  it("should not set req.aclConditions when the matched permission has none", () => {
    roleService.getOne.mockReturnValue({
      name: "viewer",
      permissions: new Map([[10, { route: 10, operations: [2] }]]),
    });

    checkAcl(req, res, next);

    expect(req.aclConditions).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it("should filter req.body.rows down to allowed fields (plus id) when the permission restricts fields", () => {
    roleService.getOne.mockReturnValue({
      name: "editor",
      permissions: new Map([
        [10, { route: 10, operations: [2], _fieldsSet: new Set(["name"]) }],
      ]),
    });
    req.body = {
      rows: [
        { id: 1, name: "a", secret: "x" },
        { id: 2, name: "b", other: 1 },
      ],
    };

    checkAcl(req, res, next);

    expect(req.body.rows).toEqual([
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should filter req.body itself down to allowed fields when it has no rows property", () => {
    roleService.getOne.mockReturnValue({
      name: "editor",
      permissions: new Map([
        [10, { route: 10, operations: [2], _fieldsSet: new Set(["name"]) }],
      ]),
    });
    req.body = { name: "a", secret: "x" };

    checkAcl(req, res, next);

    expect(req.body).toEqual({ name: "a" });
    expect(next).toHaveBeenCalledWith();
  });

  it("should leave req.body untouched when it has a non-array rows property", () => {
    roleService.getOne.mockReturnValue({
      name: "editor",
      permissions: new Map([
        [10, { route: 10, operations: [2], _fieldsSet: new Set(["name"]) }],
      ]),
    });
    req.body = { rows: "not-an-array", name: "a" };

    checkAcl(req, res, next);

    expect(req.body).toEqual({ rows: "not-an-array", name: "a" });
    expect(next).toHaveBeenCalledWith();
  });

  it("should expose the allowed field set on res.locals.aclFields for send() to project responses", () => {
    const fieldsSet = new Set(["name"]);
    roleService.getOne.mockReturnValue({
      name: "editor",
      permissions: new Map([
        [10, { route: 10, operations: [2], _fieldsSet: fieldsSet }],
      ]),
    });

    checkAcl(req, res, next);

    expect(res.locals.aclFields).toBe(fieldsSet);
    expect(next).toHaveBeenCalledWith();
  });

  it("should leave res.locals.aclFields undefined when the role has no field restriction", () => {
    roleService.getOne.mockReturnValue({
      name: "admin",
      permissions: new Map([[10, { route: 10, operations: [2] }]]),
    });

    checkAcl(req, res, next);

    expect(res.locals.aclFields).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("getScopeSegment", () => {
  let getScopeSegment;

  beforeAll(async () => {
    const module = await import(
      "../../../src/middlewares/validators/check-acl.js"
    );
    getScopeSegment = module.getScopeSegment;
  });

  it("should return the segment following resourceName", () => {
    const req = { originalUrl: "/gatelin/preferences/session" };
    expect(getScopeSegment(req, "preferences")).toBe("session");
  });

  it("should strip the query string before parsing segments", () => {
    const req = { originalUrl: "/gatelin/preferences/session?foo=bar" };
    expect(getScopeSegment(req, "preferences")).toBe("session");
  });

  it("should return null when resourceName is not found in the URL", () => {
    const req = { originalUrl: "/gatelin/routes/1" };
    expect(getScopeSegment(req, "preferences")).toBeNull();
  });

  it("should return null when resourceName is the last URL segment", () => {
    const req = { originalUrl: "/gatelin/preferences" };
    expect(getScopeSegment(req, "preferences")).toBeNull();
  });
});

describe("matchesScope", () => {
  let matchesScope;
  let scopeService;

  const scopeSvcPath = path.join(__dirname, "../../../src/services/scope.js");

  beforeAll(async () => {
    const scopeModule = await import(scopeSvcPath);
    scopeService = scopeModule.default;
    const module = await import(
      "../../../src/middlewares/validators/check-acl.js"
    );
    matchesScope = module.matchesScope;
  });

  beforeEach(() => {
    scopeService.getValues.mockClear();
  });

  it("should return true when perm.scopes is not set", () => {
    const req = { originalUrl: "/gatelin/preferences/session" };
    expect(matchesScope({}, req, "preferences")).toBe(true);
    expect(scopeService.getValues).not.toHaveBeenCalled();
  });

  it("should return true when perm.scopes resolves to an empty list", () => {
    scopeService.getValues.mockReturnValueOnce([]);
    const req = { originalUrl: "/gatelin/preferences/session" };
    expect(matchesScope({ scopes: ["x"] }, req, "preferences")).toBe(true);
  });

  it("should return true when the URL scope segment matches perm.scopes", () => {
    const req = { originalUrl: "/gatelin/preferences/session" };
    expect(
      matchesScope({ scopes: ["session", "routes"] }, req, "preferences"),
    ).toBe(true);
  });

  it("should return false when the URL scope segment does not match perm.scopes", () => {
    const req = { originalUrl: "/gatelin/preferences/services" };
    expect(
      matchesScope({ scopes: ["session", "routes"] }, req, "preferences"),
    ).toBe(false);
  });
});
