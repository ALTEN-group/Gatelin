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

describe("checkPreferenceOwnership middleware", () => {
  let checkPreferenceOwnership;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../src/middlewares/validators/check-preference-ownership.js"
    );
    checkPreferenceOwnership = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    res = { locals: { consumer: { userId: 11 } } };
    req = { params: { resource: "routes", id: "42" } };
    next = jest.fn();
  });

  it("should call next(400) when id is not a valid number", async () => {
    req.params.id = "not-a-number";

    await checkPreferenceOwnership(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Invalid preference id",
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it("should build req.body.rows and call next() when the row belongs to the user", async () => {
    execute.mockResolvedValue({ rows: [{ id: 42 }] });

    await checkPreferenceOwnership(req, res, next);

    expect(execute).toHaveBeenCalledWith(
      `SELECT id FROM preference WHERE id = $1 AND "userId" = $2 AND resource = $3`,
      [42, 11, "routes"],
      null,
    );
    expect(req.body).toEqual({ rows: [{ id: 42 }] });
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(404) when no matching row is found for this user/resource", async () => {
    execute.mockResolvedValue({ rows: [] });

    await checkPreferenceOwnership(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 404,
      message: "Preference not found",
    });
    expect(req.body).toBeUndefined();
  });

  it("should call next(404) so a system default (userId=-1) or another user's row can never be deleted", async () => {
    // The ownership-scoped query itself excludes other users/system defaults,
    // so it simply returns no rows for a foreign or shared id.
    execute.mockResolvedValue({ rows: [] });

    await checkPreferenceOwnership(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 404,
      message: "Preference not found",
    });
  });

  it("should call next(err) when the ownership query fails", async () => {
    const err = new Error("db error");
    execute.mockRejectedValue(err);

    await checkPreferenceOwnership(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
