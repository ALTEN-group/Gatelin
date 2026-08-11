/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { checkRoutePattern } from "../../../src/middlewares/validators/check-route-pattern.js";

describe("checkRoutePattern middleware", () => {
  let req, res, next;

  beforeEach(() => {
    res = {};
    next = jest.fn();
  });

  it("should call next() when req.body.rows is not an array", () => {
    req = { body: {} };

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should call next() when req.body is missing entirely", () => {
    req = {};

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should skip rows whose pattern is not a string and call next()", () => {
    req = { body: { rows: [{ pattern: 123 }, {}] } };

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should call next() for a safe, valid regex pattern", () => {
    req = { body: { rows: [{ pattern: "^/users/\\d+$" }] } };

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should reject a pattern with nested quantifiers (ReDoS risk)", () => {
    req = { body: { rows: [{ pattern: "(a+)+" }] } };

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message:
        'Route pattern "(a+)+" may cause catastrophic backtracking (ReDoS).',
    });
  });

  it("should reject a pattern with high bounded repetition (ReDoS risk)", () => {
    req = { body: { rows: [{ pattern: "(a+){10}" }] } };

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message:
        'Route pattern "(a+){10}" may cause catastrophic backtracking (ReDoS).',
    });
  });

  it("should reject a quantified character class that is ReDoS-prone", () => {
    req = { body: { rows: [{ pattern: "([a-zA-Z]+)*" }] } };

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message:
        'Route pattern "([a-zA-Z]+)*" may cause catastrophic backtracking (ReDoS).',
    });
  });

  it("should reject a pattern that is not a valid regular expression", () => {
    req = { body: { rows: [{ pattern: "(unterminated" }] } };

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message:
        'Route pattern "(unterminated" is not a valid regular expression.',
    });
  });

  it("should stop at the first invalid row and not evaluate later rows", () => {
    req = {
      body: {
        rows: [{ pattern: "(a+)+" }, { pattern: "(unterminated" }],
      },
    };

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
  });

  it("should call next() when all rows have safe patterns", () => {
    req = {
      body: {
        rows: [
          { pattern: "\\d+" },
          { pattern: "/search" },
          { pattern: "(?<id>\\d+)/history" },
        ],
      },
    };

    checkRoutePattern(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
