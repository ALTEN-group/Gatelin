/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({
  execute: jest.fn(),
}));
jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}));

describe("getRouteHistory middleware", () => {
  let getRouteHistory;
  let execute;
  let log;
  let req, res, next;

  beforeAll(async () => {
    const antity = await import("@dwtechs/antity-pgsql");
    execute = antity.execute;
    const winstanModule = await import("@dwtechs/winstan");
    log = winstanModule.log;
    const module = await import(
      "../../../src/middlewares/http/get-route-history.js"
    );
    getRouteHistory = module.getRouteHistory;
  });

  const debugMessages = () =>
    log.debug.mock.calls.map(([arg]) =>
      typeof arg === "function" ? arg() : arg,
    );

  beforeEach(() => {
    execute.mockReset();
    req = { params: { id: "3" } };
    res = { locals: {} };
    next = jest.fn();
  });

  it("should call next(err) with 'Invalid route ID' when id is not a number", () => {
    req.params.id = "abc";

    getRouteHistory(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe("Invalid route ID");
    expect(execute).not.toHaveBeenCalled();
  });

  it("should call next(err) with 'Invalid route ID' when id is less than 1", () => {
    req.params.id = "0";

    getRouteHistory(req, res, next);

    expect(next.mock.calls[0][0].message).toBe("Invalid route ID");
    expect(execute).not.toHaveBeenCalled();
  });

  it("should call next(err) with 'Invalid route ID' when id is negative", () => {
    req.params.id = "-5";

    getRouteHistory(req, res, next);

    expect(next.mock.calls[0][0].message).toBe("Invalid route ID");
  });

  it("should set res.locals.history and call next() on success", async () => {
    const rows = [{ id: 1, operation: "INSERT" }];
    execute.mockResolvedValueOnce({ rows });

    getRouteHistory(req, res, next);
    await Promise.resolve();
    await Promise.resolve();

    expect(execute).toHaveBeenCalledWith(expect.any(String), [3], null);
    expect(debugMessages()).toContain("Found 1 history records for route 3");
    expect(res.locals.history).toBe(rows);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(err) when the query rejects", async () => {
    const err = new Error("db down");
    execute.mockRejectedValueOnce(err);

    getRouteHistory(req, res, next);
    await Promise.resolve();
    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(err);
  });
});
