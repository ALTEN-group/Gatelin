/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { dropInheritedCredentials } from "../../../../src/middlewares/mappers/cors/dropInheritedCredentials.js";

describe("dropInheritedCredentials middleware", () => {
  let req, res, next;

  beforeEach(() => {
    res = {};
    next = jest.fn();
  });

  it("should set credentials false when a row renames without asserting credentials", () => {
    req = {
      body: { rows: [{ id: 1, name: "https://evil.example.com" }] },
    };

    dropInheritedCredentials(req, res, next);

    expect(req.body.rows).toEqual([
      { id: 1, name: "https://evil.example.com", credentials: false },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should leave an explicit credentials true flag in place", () => {
    req = {
      body: {
        rows: [
          {
            id: 1,
            name: "https://app.example.com",
            credentials: true,
          },
        ],
      },
    };

    dropInheritedCredentials(req, res, next);

    expect(req.body.rows[0].credentials).toBe(true);
    expect(next).toHaveBeenCalledWith();
  });

  it("should leave an explicit credentials false flag in place", () => {
    req = {
      body: {
        rows: [{ id: 1, name: "https://app.example.com", credentials: false }],
      },
    };

    dropInheritedCredentials(req, res, next);

    expect(req.body.rows[0].credentials).toBe(false);
    expect(next).toHaveBeenCalledWith();
  });

  it("should not inject credentials when the payload does not change name", () => {
    req = {
      body: { rows: [{ id: 1, description: "admin SPA" }] },
    };

    dropInheritedCredentials(req, res, next);

    expect(req.body.rows).toEqual([{ id: 1, description: "admin SPA" }]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should skip when req.body.rows is not an array and still call next()", () => {
    req = { body: {} };

    dropInheritedCredentials(req, res, next);

    expect(req.body).toEqual({});
    expect(next).toHaveBeenCalledWith();
  });
});
