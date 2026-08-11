/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const preferenceEntPath = path.join(
  __dirname,
  "../../../../src/entities/preference.js",
);

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const querySelect = jest.fn();
jest.unstable_mockModule(preferenceEntPath, () => ({
  __esModule: true,
  default: { query: { select: querySelect } },
}));

describe("assertRowsOwnedAndUnlocked middleware", () => {
  let assertRowsOwnedAndUnlocked;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../../src/middlewares/mappers/preference/assertRowsOwnedAndUnlocked.js"
    );
    assertRowsOwnedAndUnlocked = module.assertRowsOwnedAndUnlocked;
  });

  beforeEach(() => {
    execute.mockReset();
    querySelect.mockReset();
    // Default: query builder returns a plausible shape; execute defaults to
    // "all requested rows matched the security predicates".
    querySelect.mockReturnValue({ query: "SELECT ...", args: [] });
    res = { locals: { consumer: { userId: 42 } } };
    req = { params: { resource: "tableA" }, body: { rows: [] } };
    next = jest.fn();
  });

  // --- Input-shape rejections (400) ------------------------------------------

  it("rejects with 400 when req.body.rows is missing", async () => {
    req.body = {};

    await assertRowsOwnedAndUnlocked(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
    expect(execute).not.toHaveBeenCalled();
  });

  it("rejects with 400 when req.body is entirely absent", async () => {
    req = { params: { resource: "tableA" } };

    await assertRowsOwnedAndUnlocked(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
    expect(execute).not.toHaveBeenCalled();
  });

  it("rejects with 400 when req.body.rows is empty", async () => {
    req.body.rows = [];

    await assertRowsOwnedAndUnlocked(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
    expect(execute).not.toHaveBeenCalled();
  });

  it("rejects with 400 when any row is missing a valid integer id", async () => {
    req.body.rows = [{ id: 1, name: "ok" }, { name: "bad — no id" }];

    await assertRowsOwnedAndUnlocked(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining("valid integer id"),
      }),
    );
    expect(execute).not.toHaveBeenCalled();
  });

  it("rejects with 400 when an id is negative / zero / non-integer", async () => {
    req.body.rows = [{ id: -3, name: "x" }];

    await assertRowsOwnedAndUnlocked(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
    expect(execute).not.toHaveBeenCalled();
  });

  // --- Security-predicate rejections (403) -----------------------------------

  it("rejects with 403 when the DB row count is less than the requested batch size (some ids not owned / locked / wrong resource / nonexistent)", async () => {
    req.body.rows = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "c" },
    ];
    // DB returns 2 rows for the 3 requested ids — indistinguishably meaning:
    // one of {3 does not exist, 3 is owned by someone else, 3 is locked, 3
    // belongs to a different resource}. All map to the same fail-closed reject.
    execute.mockResolvedValue({ rows: [{ id: 1 }, { id: 2 }] });

    await assertRowsOwnedAndUnlocked(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: expect.stringContaining("not owned"),
      }),
    );
  });

  it("passes the correct filter shape to pEnt.query.select — scoped by ids, userId, resourceName, and locked IS FALSE", async () => {
    req.body.rows = [
      { id: 7, name: "x" },
      { id: 9, name: "y" },
    ];
    execute.mockResolvedValue({ rows: [{ id: 7 }, { id: 9 }] });

    await assertRowsOwnedAndUnlocked(req, res, next);

    expect(querySelect).toHaveBeenCalledTimes(1);
    const [, , , , filters] = querySelect.mock.calls[0];
    expect(filters).toEqual({
      id: { value: [7, 9], matchMode: "in" },
      userId: { value: 42, matchMode: "=" },
      resourceName: { value: "tableA", matchMode: "=" },
      // Critical: locked MUST use matchMode:"is" so antity-pgsql renders it
      // as `locked IS FALSE`. If future edits switch to matchMode:"=" it
      // would be silently dropped by cleanFilters (boolean columns only
      // accept {"is","isNot"}), turning this middleware fail-open.
      locked: { value: false, matchMode: "is" },
    });
  });

  // --- Happy path ------------------------------------------------------------

  it("calls next() with no arguments when every id matches the security predicates", async () => {
    req.body.rows = [
      { id: 10, name: "x" },
      { id: 11, name: "y" },
    ];
    execute.mockResolvedValue({ rows: [{ id: 10 }, { id: 11 }] });

    await assertRowsOwnedAndUnlocked(req, res, next);

    // Zero-arg next() lets the next middleware (updateArraySubstack) run.
    expect(next).toHaveBeenCalledWith();
    // next() must be called exactly once — a double call would run the
    // update handler AND the error handler, which corrupts response state.
    expect(next).toHaveBeenCalledTimes(1);
  });

  // --- Infrastructure error propagation --------------------------------------

  it("forwards a DB error to next(err) rather than falsely accepting the batch", async () => {
    req.body.rows = [{ id: 1 }, { id: 2 }];
    const dbErr = new Error("connection refused");
    execute.mockRejectedValue(dbErr);

    await assertRowsOwnedAndUnlocked(req, res, next);

    // Must be the exact error — no wrapping, no swallow, no fail-open.
    expect(next).toHaveBeenCalledWith(dbErr);
  });

  // --- Regression: fail-closed on empty DB response --------------------------

  it("rejects with 403 when the DB returns zero rows (e.g. all ids belong to other users)", async () => {
    req.body.rows = [{ id: 100 }, { id: 200 }];
    execute.mockResolvedValue({ rows: [] });

    await assertRowsOwnedAndUnlocked(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 }),
    );
  });

  it("rejects with 403 when execute() resolves to a shape without `rows` (guards against library-signature drift)", async () => {
    req.body.rows = [{ id: 5 }];
    execute.mockResolvedValue({});

    await assertRowsOwnedAndUnlocked(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 }),
    );
  });
});
