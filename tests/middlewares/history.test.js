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
        ["public", ["route"], "7"],
        null,
      );
    });

    it("should query with a custom schema when given", () => {
      execute.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      history.get("route", "gateway")(req, res, next);

      expect(execute).toHaveBeenCalledWith(
        expect.any(String),
        ["gateway", ["route"], "7"],
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
      const rows = [
        {
          id: 1,
          tstamp: "2026-01-01T00:00:00.000Z",
          operation: "INSERT",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7 },
        },
        {
          id: 2,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7 },
        },
      ];
      execute.mockResolvedValueOnce({ rowCount: 2, rows });

      history.get("route")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(res.locals.rows).toHaveLength(2);
      expect(res.locals.total).toBe(2);
      expect(next).toHaveBeenCalledWith();
    });

    it("should merge rows from the same transaction (same tstamp/consumerId/record.id) into one grouped entry", async () => {
      const rows = [
        {
          id: 1,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7, name: "route-a" },
        },
        {
          id: 2,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7, operationId: [1, 2] },
        },
        {
          id: 3,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7, methodIds: [3, 4] },
        },
      ];
      execute.mockResolvedValueOnce({ rowCount: 3, rows });

      history.get(["route", "route_operation", "route_method"])(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(res.locals.rows).toEqual([
        {
          id: 1,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: {
            id: 7,
            name: "route-a",
            operationId: [1, 2],
            methodIds: [3, 4],
          },
        },
      ]);
      expect(res.locals.total).toBe(1);
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next(404) when the only grouped action is the initial INSERT (even with junction rows)", async () => {
      const rows = [
        {
          id: 1,
          tstamp: "2026-01-01T00:00:00.000Z",
          operation: "INSERT",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7, name: "route-a" },
        },
        {
          id: 2,
          tstamp: "2026-01-01T00:00:00.000Z",
          operation: "INSERT",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7, operationId: [1, 2] },
        },
      ];
      execute.mockResolvedValueOnce({ rowCount: 2, rows });

      history.get(["route", "route_operation"])(req, res, next);
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

      history.get("route")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("groupByAction", () => {
    it("should return one entry per row when tstamp/consumerId/record.id all differ", () => {
      const rows = [
        {
          id: 1,
          tstamp: "2026-01-01T00:00:00.000Z",
          operation: "INSERT",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7 },
        },
        {
          id: 2,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7 },
        },
      ];

      expect(history.groupByAction(rows)).toEqual(rows.map((r) => ({ ...r })));
    });

    it("should merge rows sharing tstamp/consumerId/record.id and combine their record fields", () => {
      const rows = [
        {
          id: 1,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7, name: "route-a" },
        },
        {
          id: 2,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7, operationId: [1, 2] },
        },
      ];

      expect(history.groupByAction(rows)).toEqual([
        {
          id: 1,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7, name: "route-a", operationId: [1, 2] },
        },
      ]);
    });

    it("should keep rows separate when record.id differs even if tstamp/consumerId match", () => {
      const rows = [
        {
          id: 1,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 101 },
        },
        {
          id: 2,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 102 },
        },
      ];

      expect(history.groupByAction(rows)).toHaveLength(2);
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
      const rows = [
        {
          id: 1,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 7 },
        },
      ];
      execute.mockResolvedValueOnce({ rowCount: 1, rows });

      history.getByField("route", "routeId")(req, res, next);
      await Promise.resolve();
      await Promise.resolve();

      expect(execute).toHaveBeenCalledWith(
        expect.any(String),
        ["public", ["route"], "9"],
        null,
      );
      expect(res.locals.rows).toHaveLength(1);
      expect(res.locals.total).toBe(1);
      expect(next).toHaveBeenCalledWith();
    });

    it("should keep distinct records separate when several share the same tstamp/consumerId (bulk update)", async () => {
      const rows = [
        {
          id: 1,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 101, routeId: 9 },
        },
        {
          id: 2,
          tstamp: "2026-01-02T00:00:00.000Z",
          operation: "UPDATE",
          consumerUserId: 1,
          consumerName: "alice",
          record: { id: 102, routeId: 9 },
        },
      ];
      execute.mockResolvedValueOnce({ rowCount: 2, rows });

      history.getByField(["permission", "permission_condition"], "routeId")(
        req,
        res,
        next,
      );
      await Promise.resolve();
      await Promise.resolve();

      expect(res.locals.rows).toHaveLength(2);
      expect(res.locals.total).toBe(2);
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
