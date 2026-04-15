/**
 * @jest-environment node
 */

jest.mock("../../../src/services/role.js");

import roleSvc from "../../../src/services/role.js";

describe("resolvePermissions middleware", () => {
  let resolvePermissions;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../src/middlewares/mappers/resolve-permissions.js"
    );
    resolvePermissions = module.resolvePermissions;
  });

  beforeEach(() => {
    req = { body: { rows: [{ roles: [] }] } };
    res = { locals: {} };
    next = jest.fn();
  });

  describe("no roles", () => {
    it("should set empty permissions and call next() when roles array is empty", () => {
      req.body.rows[0].roles = [];
      roleSvc.getOne.mockReturnValue(undefined);

      resolvePermissions(req, res, next);

      expect(res.locals.permissions).toEqual([]);
      expect(next).toHaveBeenCalledWith();
    });

    it("should set empty permissions and call next() when rows is empty", () => {
      req.body.rows = [];

      resolvePermissions(req, res, next);

      expect(res.locals.permissions).toEqual([]);
      expect(next).toHaveBeenCalledWith();
    });

    it("should set empty permissions when role is not found in cache", () => {
      req.body.rows[0].roles = [99];
      roleSvc.getOne.mockReturnValue(undefined);

      resolvePermissions(req, res, next);

      expect(res.locals.permissions).toEqual([]);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("single role", () => {
    it("should map permissions from a single role", () => {
      req.body.rows[0].roles = [1];
      roleSvc.getOne.mockReturnValue({
        permissions: [
          { route: 6,  operations: [2],    fields: null },
          { route: 11, operations: [2, 3], fields: ["name"] },
        ],
      });

      resolvePermissions(req, res, next);

      expect(res.locals.permissions).toEqual([
        { route: 6,  operations: [2],    fields: null },
        { route: 11, operations: [2, 3], fields: ["name"] },
      ]);
      expect(next).toHaveBeenCalledWith();
    });

    it("should default fields to null when permission has no fields property", () => {
      req.body.rows[0].roles = [1];
      roleSvc.getOne.mockReturnValue({
        permissions: [{ route: 6, operations: [2] }],
      });

      resolvePermissions(req, res, next);

      expect(res.locals.permissions).toEqual([
        { route: 6, operations: [2], fields: null },
      ]);
    });
  });

  describe("multiple roles — no overlap", () => {
    it("should merge permissions from distinct routes", () => {
      req.body.rows[0].roles = [1, 2];
      roleSvc.getOne
        .mockReturnValueOnce({
          permissions: [{ route: 6, operations: [2], fields: null }],
        })
        .mockReturnValueOnce({
          permissions: [{ route: 41, operations: [2, 3], fields: null }],
        });

      resolvePermissions(req, res, next);

      expect(res.locals.permissions).toEqual([
        { route: 6,  operations: [2],    fields: null },
        { route: 41, operations: [2, 3], fields: null },
      ]);
    });
  });

  describe("multiple roles — same route, operations merge", () => {
    it("should union operations when two roles grant the same route", () => {
      req.body.rows[0].roles = [1, 2];
      roleSvc.getOne
        .mockReturnValueOnce({
          permissions: [{ route: 6, operations: [2], fields: null }],
        })
        .mockReturnValueOnce({
          permissions: [{ route: 6, operations: [5], fields: null }],
        });

      resolvePermissions(req, res, next);

      expect(res.locals.permissions).toHaveLength(1);
      expect(res.locals.permissions[0]).toEqual({
        route: 6,
        operations: expect.arrayContaining([2, 5]),
        fields: null,
      });
      expect(res.locals.permissions[0].operations).toHaveLength(2);
    });

    it("should deduplicate overlapping operations", () => {
      req.body.rows[0].roles = [1, 2];
      roleSvc.getOne
        .mockReturnValueOnce({
          permissions: [{ route: 6, operations: [2, 3], fields: null }],
        })
        .mockReturnValueOnce({
          permissions: [{ route: 6, operations: [2, 5], fields: null }],
        });

      resolvePermissions(req, res, next);

      expect(res.locals.permissions[0].operations).toEqual(
        expect.arrayContaining([2, 3, 5]),
      );
      expect(res.locals.permissions[0].operations).toHaveLength(3);
    });
  });

  describe("multiple roles — same route, fields merge", () => {
    it("should union fields when both roles restrict fields", () => {
      req.body.rows[0].roles = [1, 2];
      roleSvc.getOne
        .mockReturnValueOnce({
          permissions: [{ route: 11, operations: [2], fields: ["id", "name"] }],
        })
        .mockReturnValueOnce({
          permissions: [{ route: 11, operations: [2], fields: ["name", "description"] }],
        });

      resolvePermissions(req, res, next);

      expect(res.locals.permissions[0].fields).toEqual(
        expect.arrayContaining(["id", "name", "description"]),
      );
      expect(res.locals.permissions[0].fields).toHaveLength(3);
    });

    it("should set fields to null when one role is unrestricted (null) and the other restricts", () => {
      req.body.rows[0].roles = [1, 2];
      roleSvc.getOne
        .mockReturnValueOnce({
          permissions: [{ route: 11, operations: [2], fields: null }],
        })
        .mockReturnValueOnce({
          permissions: [{ route: 11, operations: [2], fields: ["name"] }],
        });

      resolvePermissions(req, res, next);

      expect(res.locals.permissions[0].fields).toBeNull();
    });

    it("should set fields to null when restricted role comes before unrestricted role", () => {
      req.body.rows[0].roles = [1, 2];
      roleSvc.getOne
        .mockReturnValueOnce({
          permissions: [{ route: 11, operations: [2], fields: ["name"] }],
        })
        .mockReturnValueOnce({
          permissions: [{ route: 11, operations: [2], fields: null }],
        });

      resolvePermissions(req, res, next);

      expect(res.locals.permissions[0].fields).toBeNull();
    });
  });

  describe("output does not include internal cache properties", () => {
    it("should not include _fieldsSet in permissions output", () => {
      req.body.rows[0].roles = [1];
      roleSvc.getOne.mockReturnValue({
        permissions: [
          { route: 6, operations: [2], fields: ["name"], _fieldsSet: new Set(["name"]) },
        ],
      });

      resolvePermissions(req, res, next);

      expect(res.locals.permissions[0]._fieldsSet).toBeUndefined();
    });
  });
});
