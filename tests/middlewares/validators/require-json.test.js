/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { requireJson } from "../../../src/middlewares/validators/require-json.js";

const UNSUPPORTED = {
  statusCode: 415,
  message: "Content-Type must be application/json",
};

describe("requireJson", () => {
  let req, next;

  beforeEach(() => {
    req = { headers: {} };
    next = jest.fn();
  });

  it("should accept application/json", () => {
    req.headers["content-type"] = "application/json";

    requireJson(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should accept application/json with a charset parameter", () => {
    req.headers["content-type"] = "application/json; charset=utf-8";

    requireJson(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should reject a missing Content-Type", () => {
    requireJson(req, {}, next);

    expect(next).toHaveBeenCalledWith(UNSUPPORTED);
  });

  it("should reject urlencoded bodies used by cross-site HTML forms", () => {
    req.headers["content-type"] = "application/x-www-form-urlencoded";

    requireJson(req, {}, next);

    expect(next).toHaveBeenCalledWith(UNSUPPORTED);
  });
});
