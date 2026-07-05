/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

  beforeEach(() => {
    req = { body: { email: "test@example.com", pwd: "pass123" } };
    res = { locals: {} };
    next = jest.fn();
  });

  it("should populate req.body.rows and res.locals.user on success", async () => {
    const user = {
      id: "u1",
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
      {
        filters: {
          email: { value: "test@example.com", matchMode: "equals" },
          archived: { value: false, matchMode: "is" },
        },
      },
      undefined,
    );
    expect(req.body.rows).toEqual([
      { userId: "u1", nickname: "alice", roles: [1, 2] },
    ]);
    expect(res.locals.user).toEqual({ id: "u1", active: true });
    expect(next).toHaveBeenCalledWith();
  });

  it("should set active: false for inactive user", async () => {
    const user = { id: "u2", nickname: "bob", roles: [4], active: false };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserByEmail(req, res, next);

    expect(res.locals.user).toEqual({ id: "u2", active: false });
    expect(next).toHaveBeenCalledWith();
  });

  it("should use email from req.body.email", async () => {
    req.body.email = "other@example.com";
    const user = { id: "u3", nickname: "carol", roles: [3], active: true };
    mockQuery.mockResolvedValueOnce({ data: { rows: [user] } });

    await getUserByEmail(req, res, next);

    expect(mockQuery).toHaveBeenCalledWith(
      "POST",
      "https://user.example.com",
      undefined,
      {
        filters: {
          email: { value: "other@example.com", matchMode: "equals" },
          archived: { value: false, matchMode: "is" },
        },
      },
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
});
