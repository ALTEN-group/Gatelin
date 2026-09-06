/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const roleSvcPath = path.join(__dirname, "../../../../src/services/role.js");
const permissionEntPath = path.join(
  __dirname,
  "../../../../src/entities/permission.js",
);

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const getOne = jest.fn();
jest.unstable_mockModule(roleSvcPath, () => ({
  __esModule: true,
  default: { getOne },
}));

const querySelect = jest.fn();
jest.unstable_mockModule(permissionEntPath, () => ({
  __esModule: true,
  default: { query: { select: querySelect } },
}));

function perm(operations, fields = null, scopes = null) {
  return { operations, fields, scopes };
}

function roleWith(entries) {
  return { permissions: new Map(entries) };
}

const FORBIDDEN = {
  statusCode: 403,
  message: "Cannot grant a broader permission than the caller holds",
};

const LOCKED_ROLE = {
  statusCode: 403,
  message: "Cannot change permissions on a locked system role",
};

describe("assertGrantSubset", () => {
  let assertGrantSubset;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../../src/middlewares/mappers/permission/assertGrantSubset.js"
    );
    assertGrantSubset = module.assertGrantSubset;
  });

  beforeEach(() => {
    execute.mockReset();
    querySelect.mockReset();
    getOne.mockReset();
    querySelect.mockReturnValue({ query: "SELECT ...", args: [] });
    next = jest.fn();
    req = { method: "POST", body: { rows: [] } };
    res = {
      locals: {
        route: { protected: true },
        consumer: { roles: [2] },
      },
    };
  });

  it("should skip the check on an unprotected route", async () => {
    res.locals.route.protected = false;
    req.body.rows = [{ routeId: 1, operationId: 7, fields: null }];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(getOne).not.toHaveBeenCalled();
  });

  it("should reject a caller with no role", async () => {
    res.locals.consumer = {};
    req.body.rows = [{ routeId: 28, operationId: 5, fields: ["name"] }];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Unauthorized",
    });
  });

  it("should let an unrestricted caller grant unrestricted fields", async () => {
    getOne.mockReturnValue(roleWith([[8, perm([5], null)]]));
    req.body.rows = [{ roleId: 3, routeId: 8, operationId: 5, fields: null }];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should accept POST when every row is a subset of the caller", async () => {
    getOne.mockReturnValue(roleWith([[28, perm([5, 7], ["name"])]]));
    req.body.rows = [
      { roleId: 3, routeId: 28, operationId: 5, fields: ["name"] },
      { roleId: 3, routeId: 28, operationId: 7, fields: [] },
    ];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should reject widening fields to unrestricted on POST", async () => {
    getOne.mockReturnValue(roleWith([[28, perm([5], ["name"])]]));
    req.body.rows = [{ routeId: 28, operationId: 5, fields: null }];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(FORBIDDEN);
  });

  it("should reject a field the caller does not hold", async () => {
    getOne.mockReturnValue(roleWith([[28, perm([5], ["name"])]]));
    req.body.rows = [
      { routeId: 28, operationId: 5, fields: ["name", "credentials"] },
    ];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(FORBIDDEN);
  });

  it("should reject a route or operation the caller does not hold", async () => {
    getOne.mockReturnValue(roleWith([[28, perm([5], ["name"])]]));
    req.body.rows = [{ routeId: 99, operationId: 5, fields: ["name"] }];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(FORBIDDEN);
  });

  it("should union the caller's roles before judging a grant", async () => {
    res.locals.consumer.roles = [2, 4];
    getOne.mockImplementation((id) =>
      id === 2
        ? roleWith([[28, perm([5], ["name"])]])
        : roleWith([[28, perm([5], ["pattern"])]]),
    );
    req.body.rows = [
      { roleId: 3, routeId: 28, operationId: 5, fields: ["name", "pattern"] },
    ];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should merge the stored row before checking a PUT widening", async () => {
    getOne.mockReturnValue(roleWith([[28, perm([5], ["name"])]]));
    req.method = "PUT";
    req.body.rows = [{ id: 10, fields: null }];
    execute.mockResolvedValue({
      rows: [
        { id: 10, roleId: 3, routeId: 28, operationId: 5, fields: ["name"] },
      ],
    });

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(FORBIDDEN);
  });

  it("should reject PUT that retargets a row onto a route the caller does not hold", async () => {
    getOne.mockReturnValue(roleWith([[28, perm([5], ["name"])]]));
    req.method = "PUT";
    req.body.rows = [{ id: 10, routeId: 99 }];
    execute.mockResolvedValue({
      rows: [
        { id: 10, roleId: 3, routeId: 28, operationId: 5, fields: ["name"] },
      ],
    });

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(FORBIDDEN);
  });

  it("should reject PUT that retargets unrestricted fields onto a restricted route", async () => {
    getOne.mockReturnValue(
      roleWith([
        [28, perm([5], ["name"])],
        [48, perm([7], null)],
      ]),
    );
    req.method = "PUT";
    req.body.rows = [{ id: 10, routeId: 28 }];
    execute.mockResolvedValue({
      rows: [
        { id: 10, roleId: 3, routeId: 48, operationId: 5, fields: null },
      ],
    });

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(FORBIDDEN);
  });

  it("should accept a PUT that stays within the caller's fields", async () => {
    getOne.mockReturnValue(roleWith([[28, perm([5], ["name", "pattern"])]]));
    req.method = "PUT";
    req.body.rows = [{ id: 10, fields: ["pattern"] }];
    execute.mockResolvedValue({
      rows: [
        { id: 10, roleId: 3, routeId: 28, operationId: 5, fields: ["name"] },
      ],
    });

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should reject DELETE of a permission on a route the caller does not hold", async () => {
    getOne.mockReturnValue(roleWith([[8, perm([5], null)]]));
    req.method = "DELETE";
    req.body.rows = [{ id: 10 }];
    execute.mockResolvedValue({
      rows: [
        { id: 10, roleId: 3, routeId: 99, operationId: 5, fields: null },
      ],
    });

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(FORBIDDEN);
  });

  it("should reject PUT rows without a valid id", async () => {
    req.method = "PUT";
    req.body.rows = [{ fields: ["name"] }];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Every row must carry a valid integer id",
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it("should reject PUT when an id is missing from the database", async () => {
    req.method = "PUT";
    req.body.rows = [{ id: 10, fields: ["name"] }];
    execute.mockResolvedValue({ rows: [] });

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(FORBIDDEN);
  });

  it("should forward a database failure", async () => {
    const err = new Error("db down");
    req.method = "PUT";
    req.body.rows = [{ id: 10, fields: ["name"] }];
    execute.mockRejectedValue(err);

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  it("should reject DELETE of a locked role's grant even when the caller holds it", async () => {
    getOne.mockImplementation((id) =>
      id === 2
        ? { locked: true, permissions: new Map([[8, perm([5], null)]]) }
        : { locked: true, permissions: new Map() },
    );
    req.method = "DELETE";
    req.body.rows = [{ id: 10 }];
    execute.mockResolvedValue({
      rows: [
        { id: 10, roleId: 1, routeId: 8, operationId: 5, fields: null },
      ],
    });

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(LOCKED_ROLE);
  });

  it("should reject POST onto a locked role", async () => {
    getOne.mockImplementation((id) =>
      id === 2
        ? roleWith([[28, perm([5], ["name"])]])
        : { locked: true, permissions: new Map() },
    );
    req.body.rows = [
      { roleId: 1, routeId: 28, operationId: 5, fields: ["name"] },
    ];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(LOCKED_ROLE);
  });

  it("should reject a target role missing from the cache", async () => {
    getOne.mockImplementation((id) =>
      id === 2 ? roleWith([[28, perm([5], ["name"])]]) : undefined,
    );
    req.body.rows = [
      { roleId: 99, routeId: 28, operationId: 5, fields: ["name"] },
    ];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith(LOCKED_ROLE);
  });

  it("should let Super-admin write permissions onto a locked role", async () => {
    res.locals.consumer.roles = [1];
    getOne.mockImplementation((id) =>
      id === 1
        ? { locked: true, permissions: new Map([[8, perm([5], null)]]) }
        : { locked: true, permissions: new Map() },
    );
    req.body.rows = [{ roleId: 2, routeId: 8, operationId: 5, fields: null }];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should accept POST onto an unlocked custom role", async () => {
    getOne.mockImplementation((id) =>
      id === 2
        ? roleWith([[28, perm([5], ["name"])]])
        : { locked: false, permissions: new Map() },
    );
    req.body.rows = [
      { roleId: 9, routeId: 28, operationId: 5, fields: ["name"] },
    ];

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should reject a missing rows payload", async () => {
    req.body = {};

    await assertGrantSubset(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Missing rows in req.body",
    });
  });
});
