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

describe("injectBody middleware", () => {
  let injectBody;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../../src/middlewares/mappers/preference/injectBody.js"
    );
    injectBody = module.injectBody;
  });

  beforeEach(() => {
    res = {
      locals: { consumer: { userId: 11 } },
      json: jest.fn(),
    };
    req = { params: { resource: "dashboard" } };
    next = jest.fn();
  });

  it("should create req.body when missing", () => {
    req.body = undefined;
    req.body = { rows: [{ name: "a" }] };

    injectBody(req, res, next);

    expect(req.body).toBeDefined();
  });

  it("should respond directly with an empty sync payload when rows is empty, without calling next()", () => {
    req.body = { rows: [] };

    injectBody(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      rows: [],
      sync: { inserted: 0, updated: 0, deleted: 0 },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should respond directly when req.body.rows is missing entirely", () => {
    req.body = {};

    injectBody(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      rows: [],
      sync: { inserted: 0, updated: 0, deleted: 0 },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should inject userId and resource into each row, set conflictTarget, and call next()", () => {
    req.body = {
      rows: [
        { name: "theme", value: "dark" },
        { name: "layout", value: "grid" },
      ],
    };

    injectBody(req, res, next);

    expect(req.body.rows).toEqual([
      { name: "theme", value: "dark", userId: 11, resource: "dashboard" },
      { name: "layout", value: "grid", userId: 11, resource: "dashboard" },
    ]);
    expect(req.body.conflictTarget).toEqual(["userId", "resource", "name"]);
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });
});
