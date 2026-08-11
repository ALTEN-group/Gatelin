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

describe("checkRefreshToken middleware", () => {
  let checkRefreshToken;
  let log;
  let req, res, next;

  beforeAll(async () => {
    const winstanModule = await import("@dwtechs/winstan");
    log = winstanModule.log;
    const module = await import(
      "../../../src/middlewares/validators/check-refreshToken.js"
    );
    checkRefreshToken = module.checkRefreshToken;
  });

  const debugMessages = () =>
    log.debug.mock.calls.map(([arg]) =>
      typeof arg === "function" ? arg() : arg,
    );

  beforeEach(() => {
    next = jest.fn();
  });

  it("should call next() when the body token matches the stored consumer token", () => {
    req = { body: { refreshToken: "same-token-value" } };
    res = { locals: { consumer: { refreshToken: "same-token-value" } } };

    checkRefreshToken(req, res, next);

    expect(debugMessages()).toContain("checkRefreshToken(match=true)");
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(401) when tokens differ but have the same length", () => {
    req = { body: { refreshToken: "aaaaaaaaaa" } };
    res = { locals: { consumer: { refreshToken: "bbbbbbbbbb" } } };

    checkRefreshToken(req, res, next);

    expect(debugMessages()).toContain("checkRefreshToken(match=false)");
    expect(next).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Unauthorized",
    });
  });

  it("should call next(401) when tokens have different lengths (no crypto compare attempted)", () => {
    req = { body: { refreshToken: "short" } };
    res = { locals: { consumer: { refreshToken: "a-much-longer-token" } } };

    checkRefreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Unauthorized",
    });
  });

  it("should call next(401) when the body token is missing/non-string", () => {
    req = { body: {} };
    res = { locals: { consumer: { refreshToken: "some-token" } } };

    checkRefreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Unauthorized",
    });
  });

  it("should call next(401) when the stored consumer token is missing/non-string", () => {
    req = { body: { refreshToken: "some-token" } };
    res = { locals: { consumer: {} } };

    checkRefreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Unauthorized",
    });
  });

  it("should fall back to the cookie when the body token is absent and it matches", () => {
    req = { body: {}, cookies: { refreshToken: "cookie-token-value" } };
    res = { locals: { consumer: { refreshToken: "cookie-token-value" } } };

    checkRefreshToken(req, res, next);

    expect(debugMessages()).toContain("checkRefreshToken(match=true)");
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(401) when only the cookie token is present and it doesn't match", () => {
    req = { body: {}, cookies: { refreshToken: "wrong-token-value" } };
    res = { locals: { consumer: { refreshToken: "cookie-token-value" } } };

    checkRefreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Unauthorized",
    });
  });

  it("should prefer the body token over the cookie when both are present", () => {
    req = {
      body: { refreshToken: "body-token-value" },
      cookies: { refreshToken: "cookie-token-value" },
    };
    res = { locals: { consumer: { refreshToken: "body-token-value" } } };

    checkRefreshToken(req, res, next);

    expect(debugMessages()).toContain("checkRefreshToken(match=true)");
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(401) when both body and cookie tokens are absent", () => {
    req = { body: {}, cookies: {} };
    res = { locals: { consumer: { refreshToken: "some-token" } } };

    checkRefreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Unauthorized",
    });
  });
});
