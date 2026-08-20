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

describe("updateHeaderWithConsumer middleware", () => {
  let updateHeaderWithConsumer;
  let log;
  let req, res, next;

  beforeAll(async () => {
    const winstanModule = await import("@dwtechs/winstan");
    log = winstanModule.log;
    const module = await import(
      "../../../src/middlewares/mappers/additionalHeaders.js"
    );
    updateHeaderWithConsumer = module.default;
  });

  beforeEach(() => {
    req = {};
    res = {
      locals: {
        route: { protected: true },
        tokens: { decodedAccess: { iss: "consumer-123", sub: "user-456" } },
        consumer: { nickname: "testuser" },
      },
    };
    next = jest.fn();
    log.debug.mockClear();
  });

  describe("protected route", () => {
    it("should set additionalHeaders from token and consumer, call next()", () => {
      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-user-id": "consumer-123",
        "x-consumer-name": "testuser",
      });
      expect(next).toHaveBeenCalledWith();
      const debugMessages = log.debug.mock.calls.map(([arg]) =>
        typeof arg === "function" ? arg() : arg,
      );
      expect(debugMessages).toContain(
        "updateHeaderWithConsumer(decodedAccessToken=<present>)",
      );
      expect(debugMessages).toContain(
        `updateHeaders(${JSON.stringify({ "x-consumer-user-id": "consumer-123", "x-consumer-name": "testuser" })})`,
      );
    });

    it("should use iss as consumer-id and nickname as consumer-name", () => {
      res.locals.tokens.decodedAccess.iss = "other-consumer";
      res.locals.consumer.nickname = "other_user";

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-user-id": "other-consumer",
        "x-consumer-name": "other_user",
      });
      expect(next).toHaveBeenCalledWith();
    });

    it("should add x-acl-conditions header when req.aclConditions is a non-empty array", () => {
      req.aclConditions = [{ field: "archived", op: "=", value: false }];

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders["x-acl-conditions"]).toBe(
        JSON.stringify(req.aclConditions),
      );
      expect(next).toHaveBeenCalledWith();
    });

    it("should add x-acl-fields when res.locals.aclFields is a Set", () => {
      res.locals.aclFields = new Set(["name", "length"]);

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders["x-acl-fields"]).toBe("name,length");
      expect(next).toHaveBeenCalledWith();
    });

    it("should add an empty x-acl-fields header when the allow-list is empty", () => {
      res.locals.aclFields = new Set();

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders["x-acl-fields"]).toBe("");
      expect(next).toHaveBeenCalledWith();
    });

    it("should not add x-acl-fields when aclFields is unrestricted", () => {
      res.locals.aclFields = null;

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders["x-acl-fields"]).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("unprotected route", () => {
    it("should skip header setup and call next() immediately", () => {
      res.locals.route.protected = false;

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
      expect(log.debug).not.toHaveBeenCalled();
    });

    it("should skip when protected is null", () => {
      res.locals.route.protected = null;

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("error conditions", () => {
    it("should throw when res.locals.route is undefined", () => {
      res.locals.route = undefined;

      expect(() => updateHeaderWithConsumer(req, res, next)).toThrow();
    });

    it("should throw when res.locals.tokens is undefined on a protected route", () => {
      res.locals.tokens = undefined;

      expect(() => updateHeaderWithConsumer(req, res, next)).toThrow();
    });
  });
});
