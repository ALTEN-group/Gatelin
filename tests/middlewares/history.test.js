/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({
  execute: jest.fn(),
}));

describe("history middleware", () => {
  let history;
  let execute;
  let req, res, next;

  beforeAll(async () => {
    const antity = await import("@dwtechs/antity-pgsql");
    execute = antity.execute;
    const module = await import("../../src/middlewares/history.js");
    history = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    req = { params: { id: "7" } };
    res = { locals: {} };
    next = jest.fn();
  });

  describe("get", () => {
    it("should call next(400) when id param is missing", () => {
      req.params.id = undefined;

      history.get("route")(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing id" });
      expect(execute).not.toHaveBeenCalled();
    });

    it("should query with the default 'public' schema when none is given", () => {
      execute.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      history.get("route")(req, res, next);

      expect(execute).toHaveBeenCalledWith(
        expect.any(String),
        ["public", "route", "7"],
        null,
      );
    });

    it("should query with a custom schema when given", () => {
      execute.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      history.get("route", "gateway")(req, res, next);

      expect(execute).toHaveBeenCalledWith(
        expect.any(String),
        ["gateway", "route", "7"],
        null,
      );
    });

    it("should call next(404) when no history rows are found", async () => {
      execute.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      history.get("route")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(next).toHaveBeenCalledWith({
        status: 404,
        msg: "history not found",
      });
    });

    it("should call next(404) when the single row is the initial INSERT", async () => {
      execute.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ operation: "INSERT" }],
      });

      history.get("route")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(next).toHaveBeenCalledWith({
        status: 404,
        msg: "history not found",
      });
    });

    it("should set res.locals.rows/total and call next() when history exists beyond the initial INSERT", async () => {
      const rows = [{ operation: "INSERT" }, { operation: "UPDATE" }];
      execute.mockResolvedValueOnce({ rowCount: 2, rows });

      history.get("route")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(res.locals.rows).toBe(rows);
      expect(res.locals.total).toBe(2);
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next(err) when the query rejects", async () => {
      const err = new Error("db down");
      execute.mockRejectedValueOnce(err);

      history.get("route")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("getByField", () => {
    beforeEach(() => {
      req = { params: { routeId: "9" } };
    });

    it("should call next(400) when the field value is missing", () => {
      req.params.routeId = undefined;

      history.getByField("route", "routeId")(req, res, next);

      expect(next).toHaveBeenCalledWith({
        status: 400,
        msg: "Missing routeId",
      });
      expect(execute).not.toHaveBeenCalled();
    });

    it("should throw synchronously for a field not in the allow-list", () => {
      req.params.name = "abc";

      expect(() => history.getByField("route", "name")(req, res, next)).toThrow(
        "Invalid history field: name",
      );
    });

    it("should set res.locals.rows/total and call next() for a valid allowed field", async () => {
      const rows = [{ operation: "UPDATE" }];
      execute.mockResolvedValueOnce({ rowCount: 1, rows });

      history.getByField("route", "routeId")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(execute).toHaveBeenCalledWith(
        expect.any(String),
        ["public", "route", "9"],
        null,
      );
      expect(res.locals.rows).toBe(rows);
      expect(res.locals.total).toBe(1);
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next(404) when no rows are found for the field", async () => {
      execute.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      history.getByField("route", "routeId")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(next).toHaveBeenCalledWith({
        status: 404,
        msg: "history not found",
      });
    });

    it("should call next(err) when the query rejects", async () => {
      const err = new Error("db down");
      execute.mockRejectedValueOnce(err);

      history.getByField("route", "routeId")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
