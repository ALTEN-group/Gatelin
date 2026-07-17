/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}));

describe("check-preference-ownership middlewares", () => {
  let injectOwnershipFilters, checkOwnershipFound;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../src/middlewares/validators/check-preference-ownership.js"
    );
    injectOwnershipFilters = module.injectOwnershipFilters;
    checkOwnershipFound = module.checkOwnershipFound;
  });

  beforeEach(() => {
    res = { locals: { consumer: { userId: 11 } } };
    req = { params: { resource: "routes", id: "42" } };
    next = jest.fn();
  });

  describe("injectOwnershipFilters", () => {
    it("should call next(400) when id is not a valid number", () => {
      req.params.id = "not-a-number";

      injectOwnershipFilters(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: "Invalid preference id",
      });
      expect(req.body).toBeUndefined();
    });

    it("should build req.body.filters and call next()", () => {
      injectOwnershipFilters(req, res, next);

      expect(req.body).toEqual({
        filters: {
          id: { value: 42, matchMode: "=" },
          userId: { value: 11, matchMode: "=" },
          resource: { value: "routes", matchMode: "=" },
        },
      });
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("checkOwnershipFound", () => {
    beforeEach(() => {
      req.body = { filters: {} };
    });

    it("should call next(404) when no matching row was found", () => {
      res.locals.rows = [];

      checkOwnershipFound(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Preference not found",
      });
      expect(req.body.rows).toBeUndefined();
    });

    it("should call next(404) so a system default (userId=-1) or another user's row can never be deleted", () => {
      // The ownership-scoped filters injected upstream already exclude other
      // users/system defaults, so pEnt.get simply returns no rows for a
      // foreign or shared id.
      res.locals.rows = undefined;

      checkOwnershipFound(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Preference not found",
      });
    });

    it("should build req.body.rows and call next() when the row belongs to the user", () => {
      res.locals.rows = [{ id: 42 }];

      checkOwnershipFound(req, res, next);

      expect(req.body.rows).toEqual([{ id: 42 }]);
      expect(next).toHaveBeenCalledWith();
    });
  });
});
