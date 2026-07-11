/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

describe("csrf-cookie middlewares", () => {
  let setCsrfCookie;
  let clearCsrfCookie;
  let res;
  let next;

  beforeAll(async () => {
    const module = await import("../../../src/middlewares/res/csrf-cookie.js");
    setCsrfCookie = module.setCsrfCookie;
    clearCsrfCookie = module.clearCsrfCookie;
  });

  beforeEach(() => {
    res = { cookie: jest.fn(), clearCookie: jest.fn() };
    next = jest.fn();
  });

  describe("setCsrfCookie", () => {
    it("should set a non-httpOnly cookie with the default name and options, then call next()", () => {
      setCsrfCookie({}, res, next);

      expect(res.cookie).toHaveBeenCalledTimes(1);
      const [name, value, options] = res.cookie.mock.calls[0];
      expect(name).toBe("csrfToken");
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
      expect(options).toEqual({
        httpOnly: false,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      expect(next).toHaveBeenCalledWith();
    });

    it("should generate a different token on each call", () => {
      setCsrfCookie({}, res, next);
      const firstToken = res.cookie.mock.calls[0][1];

      setCsrfCookie({}, res, next);
      const secondToken = res.cookie.mock.calls[1][1];

      expect(firstToken).not.toBe(secondToken);
    });
  });

  describe("clearCsrfCookie", () => {
    it("should clear the cookie with the default name and path, then call next()", () => {
      clearCsrfCookie({}, res, next);

      expect(res.clearCookie).toHaveBeenCalledWith("csrfToken", { path: "/" });
      expect(next).toHaveBeenCalledWith();
    });
  });
});
