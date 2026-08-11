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

describe("checkCsrf middleware", () => {
  let checkCsrf;
  let log;
  let req, next;

  beforeAll(async () => {
    const winstanModule = await import("@dwtechs/winstan");
    log = winstanModule.log;
    const module = await import(
      "../../../src/middlewares/validators/check-csrf.js"
    );
    checkCsrf = module.checkCsrf;
  });

  const debugMessages = () =>
    log.debug.mock.calls.map(([arg]) =>
      typeof arg === "function" ? arg() : arg,
    );

  beforeEach(() => {
    next = jest.fn();
  });

  it("should call next() when the cookie token matches the header token", () => {
    req = {
      cookies: { csrfToken: "same-token-value" },
      headers: { "x-csrf-token": "same-token-value" },
    };

    checkCsrf(req, {}, next);

    expect(debugMessages()).toContain("checkCsrf(match=true)");
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(403) when tokens differ but have the same length", () => {
    req = {
      cookies: { csrfToken: "aaaaaaaaaa" },
      headers: { "x-csrf-token": "bbbbbbbbbb" },
    };

    checkCsrf(req, {}, next);

    expect(debugMessages()).toContain("checkCsrf(match=false)");
    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Invalid CSRF token",
    });
  });

  it("should call next(403) when tokens have different lengths (no crypto compare attempted)", () => {
    req = {
      cookies: { csrfToken: "short" },
      headers: { "x-csrf-token": "a-much-longer-token" },
    };

    checkCsrf(req, {}, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Invalid CSRF token",
    });
  });

  it("should call next(403) when the cookie token is missing", () => {
    req = { cookies: {}, headers: { "x-csrf-token": "some-token" } };

    checkCsrf(req, {}, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Invalid CSRF token",
    });
  });

  it("should call next(403) when the header token is missing", () => {
    req = { cookies: { csrfToken: "some-token" }, headers: {} };

    checkCsrf(req, {}, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Invalid CSRF token",
    });
  });

  it("should call next(403) when both cookie and header tokens are absent", () => {
    req = { cookies: {}, headers: {} };

    checkCsrf(req, {}, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Invalid CSRF token",
    });
  });
});
