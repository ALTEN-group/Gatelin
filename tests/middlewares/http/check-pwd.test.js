/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const httpUtilPath = path.join(__dirname, "../../../src/utils/http.js");

process.env.PWD_CHECK_URL = "https://auth.example.com";

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

describe("checkPwd middleware", () => {
  let checkPwd;
  let mockQuery;
  let req, res, next;

  beforeAll(async () => {
    const httpModule = await import("../../../src/utils/http.js");
    mockQuery = httpModule.default.query;
    const module = await import("../../../src/middlewares/http/check-pwd.js");
    checkPwd = module.checkPwd;
  });

  const filters = {
    userId: { value: 1, matchMode: "=" },
    pwd: { value: "testpassword", matchMode: "=" },
  };

  beforeEach(() => {
    req = {
      body: { userId: 1, pwd: "testpassword", filters },
      additionalHeaders: { "x-consumer-user-id": "consumer123" },
    };
    res = { locals: { user: { id: 1 } } };
    next = jest.fn();
  });

  it("should call next() when authentication succeeds", async () => {
    mockQuery.mockResolvedValueOnce({
      data: { rows: [{ userId: 1, twoFactorEnabled: false }] },
    });

    await checkPwd(req, res, next);

    expect(mockQuery).toHaveBeenCalledWith(
      "POST",
      "https://auth.example.com",
      undefined,
      { userId: 1, pwd: "testpassword" },
      { "x-consumer-user-id": "consumer123" },
    );
    expect(res.locals.pwdRow).toEqual({
      userId: 1,
      twoFactorEnabled: false,
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("should forward req.body.userId/pwd as-is set by an upstream middleware", async () => {
    req.body.userId = 42;
    mockQuery.mockResolvedValueOnce({ data: {} });

    await checkPwd(req, res, next);

    expect(mockQuery).toHaveBeenCalledWith(
      "POST",
      "https://auth.example.com",
      undefined,
      { userId: 42, pwd: "testpassword" },
      expect.any(Object),
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("should use empty object when additionalHeaders is absent", async () => {
    delete req.additionalHeaders;
    mockQuery.mockResolvedValueOnce({ data: {} });

    await checkPwd(req, res, next);

    expect(mockQuery).toHaveBeenLastCalledWith(
      "POST",
      "https://auth.example.com",
      undefined,
      { userId: 1, pwd: "testpassword" },
      {},
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(err) when the http call rejects", async () => {
    const error = new Error("Unauthorized");
    mockQuery.mockRejectedValueOnce(error);

    await checkPwd(req, res, next);
    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should propagate network errors to next", async () => {
    const networkError = new Error("Network timeout");
    mockQuery.mockRejectedValueOnce(networkError);

    await checkPwd(req, res, next);
    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(networkError);
  });
});
