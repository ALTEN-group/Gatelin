/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const httpUtilPath = path.join(__dirname, "../../../src/utils/http.js");

process.env.USER_SEARCH_URL = "https://user.example.com";

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}));
jest.unstable_mockModule(httpUtilPath, () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

describe("getUserByEmail middleware", () => {
  let getUserByEmail;
  let mockQuery;
  let req, res, next;

  beforeAll(async () => {
    const httpModule = await import("../../../src/utils/http.js");
    mockQuery = httpModule.default.query;
    const module = await import("../../../src/middlewares/http/get-user.js");
    getUserByEmail = module.getUserByEmail;
  });

  const filters = {
    email: { value: "test@example.com", matchMode: "equals" },
    archived: { value: false, matchMode: "IS" },
  };

  beforeEach(() => {
    req = { body: { email: "test@example.com", pwd: "pass123", filters } };
    res = { locals: {} };
    next = jest.fn();
  });

  it("should populate req.body.rows and res.locals.user on success", async () => {
    const user = {
      id: 1,
      nickname: "alice",
      roles: [1, 2],
      active: true,
      email: "test@example.com",
    };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserByEmail(req, res, next);

    expect(mockQuery).toHaveBeenCalledWith(
      "POST",
      "https://user.example.com",
      undefined,
      { filters },
      undefined,
    );
    expect(req.body.rows).toEqual([
      { userId: 1, nickname: "alice", roles: [1, 2] },
    ]);
    expect(res.locals.user).toEqual({ id: 1, active: true });
    expect(next).toHaveBeenCalledWith();
  });

  it("should set active: false for inactive user", async () => {
    const user = { id: 2, nickname: "bob", roles: [4], active: false };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserByEmail(req, res, next);

    expect(res.locals.user).toEqual({ id: 2, active: false });
    expect(next).toHaveBeenCalledWith();
  });

  it("should forward req.body.filters as-is set by an upstream middleware", async () => {
    req.body.filters = {
      email: { value: "other@example.com", matchMode: "equals" },
      archived: { value: false, matchMode: "IS" },
    };
    const user = { id: 3, nickname: "carol", roles: [3], active: true };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserByEmail(req, res, next);

    expect(mockQuery).toHaveBeenCalledWith(
      "POST",
      "https://user.example.com",
      undefined,
      { filters: req.body.filters },
      undefined,
    );
  });

  it("should call next(err) on service error", async () => {
    const error = new Error("Service unavailable");
    mockQuery.mockRejectedValueOnce(error);

    await getUserByEmail(req, res, next);
    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should call next(422) when the returned user has an invalid/missing id", async () => {
    const user = {
      id: "not-an-integer",
      nickname: "eve",
      roles: [1],
      active: true,
    };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserByEmail(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 422,
      message: "Invalid user id",
    });
    expect(req.body.rows).toBeUndefined();
  });

  it("should call next(422) when the returned user has an invalid/missing nickname", async () => {
    const user = { id: 4, nickname: 123, roles: [1], active: true };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserByEmail(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 422,
      message: "Invalid user nickname",
    });
    expect(req.body.rows).toBeUndefined();
  });

  it("should call next(422) when the returned user has invalid/missing roles", async () => {
    const user = {
      id: 5,
      nickname: "dave",
      roles: "not-an-array",
      active: true,
    };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserByEmail(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 422,
      message: "Invalid user roles",
    });
  });

  it("should call next(422) when no user row is returned", async () => {
    mockQuery.mockResolvedValueOnce({ data: { rows: [] } });

    await getUserByEmail(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 422,
      message: "Invalid user id",
    });
  });
});

describe("getUserById middleware", () => {
  let getUserById;
  let mockQuery;
  let req, res, next;

  beforeAll(async () => {
    const httpModule = await import("../../../src/utils/http.js");
    mockQuery = httpModule.default.query;
    const module = await import("../../../src/middlewares/http/get-user.js");
    getUserById = module.getUserById;
  });

  const filters = { id: { value: 1, matchMode: "=" } };

  beforeEach(() => {
    mockQuery.mockReset();
    req = { body: { filters, rows: [{ userId: 1 }] } };
    res = { locals: {} };
    next = jest.fn();
  });

  it("should merge nickname/roles into the existing req.body.rows[0] on success", async () => {
    const user = { id: 1, nickname: "alice", roles: [1, 2] };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserById(req, res, next);

    expect(mockQuery).toHaveBeenCalledWith(
      "POST",
      "https://user.example.com",
      undefined,
      { filters },
      undefined,
    );
    expect(req.body.rows[0]).toEqual({
      userId: 1,
      nickname: "alice",
      roles: [1, 2],
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(422) when the returned user has an invalid/missing nickname", async () => {
    const user = { id: 1, nickname: null, roles: [1] };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserById(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 422,
      message: "Invalid user nickname",
    });
  });

  it("should call next(422) when the returned user has invalid/missing roles", async () => {
    const user = { id: 1, nickname: "alice", roles: null };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserById(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 422,
      message: "Invalid user roles",
    });
  });

  it("should call next(err) when the service call rejects", async () => {
    const error = new Error("Service unavailable");
    mockQuery.mockRejectedValueOnce(error);

    await getUserById(req, res, next);
    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(error);
  });
});
