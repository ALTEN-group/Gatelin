/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const preferenceEntPath = path.join(
  __dirname,
  "../../../../src/entities/preference.js",
);

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
jest.unstable_mockModule(preferenceEntPath, () => ({
  __esModule: true,
  default: {
    query: {
      insertArray: jest.fn(),
      updateArray: jest.fn(),
    },
  },
}));

describe("upsertRows middleware", () => {
  let upsertRows;
  let execute;
  let pEnt;
  let req, res, next;

  beforeAll(async () => {
    const antity = await import("@dwtechs/antity-pgsql");
    execute = antity.execute;
    const entModule = await import("../../../../src/entities/preference.js");
    pEnt = entModule.default;
    const module = await import(
      "../../../../src/middlewares/mappers/preference/upsertRows.js"
    );
    upsertRows = module.upsertRows;
  });

  beforeEach(() => {
    execute.mockReset();
    pEnt.query.insertArray.mockReset();
    pEnt.query.updateArray.mockReset();
    res = { locals: {} };
    next = jest.fn();
  });

  it("should call next() with empty results when there are no rows", async () => {
    req = { body: { rows: [] } };

    await upsertRows(req, res, next);

    expect(pEnt.query.insertArray).not.toHaveBeenCalled();
    expect(pEnt.query.updateArray).not.toHaveBeenCalled();
    expect(res.locals.rows).toEqual([]);
    expect(res.locals.total).toBe(0);
    expect(next).toHaveBeenCalledWith();
  });

  it("should insert rows without an id", async () => {
    req = { body: { rows: [{ name: "a" }] } };
    pEnt.query.insertArray.mockReturnValue({
      query: "INSERT ...",
      args: ["a"],
    });
    execute.mockResolvedValueOnce({ rows: [{ id: 1, name: "a" }] });

    await upsertRows(req, res, next);

    expect(pEnt.query.insertArray).toHaveBeenCalledWith([{ name: "a" }]);
    expect(pEnt.query.updateArray).not.toHaveBeenCalled();
    expect(execute).toHaveBeenCalledWith("INSERT ...", ["a"], null);
    expect(res.locals.rows).toEqual([{ id: 1, name: "a" }]);
    expect(res.locals.total).toBe(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should update rows that have an id", async () => {
    req = { body: { rows: [{ id: 5, name: "b" }] } };
    pEnt.query.updateArray.mockReturnValue({
      query: "UPDATE ...",
      args: ["b"],
    });
    execute.mockResolvedValueOnce({ rows: [{ id: 5, name: "b" }] });

    await upsertRows(req, res, next);

    expect(pEnt.query.updateArray).toHaveBeenCalledWith([{ id: 5, name: "b" }]);
    expect(pEnt.query.insertArray).not.toHaveBeenCalled();
    expect(res.locals.rows).toEqual([{ id: 5, name: "b" }]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should handle a mix of inserts and updates, concatenating results", async () => {
    req = {
      body: {
        rows: [{ name: "insert-me" }, { id: 2, name: "update-me" }],
      },
    };
    pEnt.query.insertArray.mockReturnValue({ query: "INSERT", args: [] });
    pEnt.query.updateArray.mockReturnValue({ query: "UPDATE", args: [] });
    execute
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "insert-me" }] })
      .mockResolvedValueOnce({ rows: [{ id: 2, name: "update-me" }] });

    await upsertRows(req, res, next);

    expect(res.locals.rows).toEqual([
      { id: 1, name: "insert-me" },
      { id: 2, name: "update-me" },
    ]);
    expect(res.locals.total).toBe(2);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(err) when execute rejects", async () => {
    req = { body: { rows: [{ name: "a" }] } };
    pEnt.query.insertArray.mockReturnValue({ query: "INSERT", args: [] });
    const err = new Error("db down");
    execute.mockRejectedValueOnce(err);

    await upsertRows(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.locals.rows).toBeUndefined();
  });
});
