/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corsSvcPath = path.join(__dirname, "../../src/services/cors.js");

const has = jest.fn();
const getCredentials = jest.fn();
jest.unstable_mockModule(corsSvcPath, () => ({
  __esModule: true,
  default: { has, getCredentials },
}));

describe("corsMiddleware", () => {
  let corsMiddleware;
  let req, res, next;

  beforeAll(async () => {
    const module = await import("../../src/conf/cors.js");
    corsMiddleware = module.corsMiddleware;
  });

  beforeEach(() => {
    has.mockReset();
    getCredentials.mockReset();
    req = { headers: {}, method: "GET" };
    res = { setHeader: jest.fn(), end: jest.fn(), statusCode: 200 };
    next = jest.fn();
  });

  it("should skip origin checks and call next() when there is no Origin header", () => {
    corsMiddleware(req, res, next);

    expect(has).not.toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Methods",
      expect.any(String),
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("should reject an origin that isn't in the whitelist", () => {
    req.headers.origin = "http://evil.example.com";
    has.mockReturnValue(false);

    corsMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "CORS policy violation",
    });
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Access-Control-Allow-Origin",
      expect.anything(),
    );
  });

  it("should allow a whitelisted origin without credentials", () => {
    req.headers.origin = "http://ok.example.com";
    has.mockReturnValue(true);
    getCredentials.mockReturnValue(false);

    corsMiddleware(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Origin",
      "http://ok.example.com",
    );
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Access-Control-Allow-Credentials",
      "true",
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("should set the credentials header for a whitelisted origin that allows them", () => {
    req.headers.origin = "http://ok.example.com";
    has.mockReturnValue(true);
    getCredentials.mockReturnValue(true);

    corsMiddleware(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Credentials",
      "true",
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("should short-circuit an OPTIONS preflight with a 204 and not call next()", () => {
    req.headers.origin = "http://ok.example.com";
    req.method = "OPTIONS";
    has.mockReturnValue(true);
    getCredentials.mockReturnValue(false);

    corsMiddleware(req, res, next);

    expect(res.statusCode).toBe(204);
    expect(res.end).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalled();
  });
});
