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

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

describe("getPreferences middleware", () => {
  let getPreferences;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../../src/middlewares/mappers/preference/getPreferences.js"
    );
    getPreferences = module.getPreferences;
  });

  beforeEach(() => {
    execute.mockReset();
    execute.mockResolvedValue({ rows: [] });
    res = { locals: { consumer: { userId: 11 } } };
    req = { params: { resource: "dashboard" } };
    next = jest.fn();
  });

  it("should fetch the merged rows for (userId, resource) and set res.locals.rows/total", async () => {
    const rows = [
      {
        id: 1,
        resource: "dashboard",
        name: "a",
        conf: {},
        locked: true,
        isActive: true,
      },
      {
        id: 2,
        resource: "dashboard",
        name: "b",
        conf: {},
        locked: false,
        isActive: false,
      },
    ];
    execute.mockResolvedValue({ rows });

    await getPreferences(req, res, next);

    expect(execute).toHaveBeenCalledTimes(1);
    const [, args] = execute.mock.calls[0];
    expect(args).toEqual([11, "dashboard"]);
    expect(res.locals.rows).toBe(rows);
    expect(res.locals.total).toBe(2);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(err) when the merged query fails", async () => {
    const err = new Error("db error");
    execute.mockRejectedValue(err);

    await getPreferences(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
