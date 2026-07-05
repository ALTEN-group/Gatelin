/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

  beforeEach(() => {
    req = {
      body: { pwd: "testpassword" },
      additionalHeaders: { "x-consumer-id": "consumer123" },
    };
    res = { locals: { user: { id: 1 } } };
    next = jest.fn();
  });

  it("should call next() when authentication succeeds", async () => {
    mockQuery.mockResolvedValueOnce({ data: {} });

    await checkPwd(req, res, next);

    expect(mockQuery).toHaveBeenCalledWith(
      "POST",
      "https://auth.example.com",
      undefined,
      {
        filters: {
          userId: { value: 1, matchMode: "equals" },
          pwd: { value: "testpassword", matchMode: "equals" },
        },
      },
      { "x-consumer-id": "consumer123" },
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("should use userId from res.locals.user.id", async () => {
    res.locals.user.id = 42;
    mockQuery.mockResolvedValueOnce({ data: {} });

    await checkPwd(req, res, next);

    expect(mockQuery).toHaveBeenCalledWith(
      "POST",
      "https://auth.example.com",
      undefined,
      {
        filters: {
          userId: { value: 42, matchMode: "equals" },
          pwd: { value: "testpassword", matchMode: "equals" },
        },
      },
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
      {
        filters: {
          userId: { value: 1, matchMode: "equals" },
          pwd: { value: "testpassword", matchMode: "equals" },
        },
      },
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
