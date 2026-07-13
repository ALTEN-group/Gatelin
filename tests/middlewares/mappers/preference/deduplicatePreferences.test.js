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

describe("deduplicatePreferences middleware", () => {
  let deduplicatePreferences;
  let log;
  let req, res, next;

  beforeAll(async () => {
    const winstanModule = await import("@dwtechs/winstan");
    log = winstanModule.log;
    const module = await import(
      "../../../../src/middlewares/mappers/preference/deduplicatePreferences.js"
    );
    deduplicatePreferences = module.deduplicatePreferences;
  });

  const debugMessages = () =>
    log.debug.mock.calls.map(([arg]) =>
      typeof arg === "function" ? arg() : arg,
    );

  beforeEach(() => {
    req = {};
    next = jest.fn();
  });

  it("should call next() without touching res.locals.rows when rows is undefined", () => {
    res = { locals: {} };

    deduplicatePreferences(req, res, next);

    expect(res.locals.rows).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next() without changes when rows is an empty array", () => {
    res = { locals: { rows: [] } };

    deduplicatePreferences(req, res, next);

    expect(res.locals.rows).toEqual([]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should remove the system (locked) row when a user override with the same name exists", () => {
    res = {
      locals: {
        rows: [
          { name: "theme", locked: true, conf: { a: 1 }, value: "light" },
          { name: "theme", locked: false, conf: { a: 2 }, value: "dark" },
        ],
      },
    };

    deduplicatePreferences(req, res, next);

    expect(res.locals.rows).toEqual([
      { name: "theme", locked: false, conf: { a: 2 }, value: "dark" },
    ]);
    expect(debugMessages()).toContain(
      "deduplicatePreferences: 2 rows → 1 after dedup",
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("should re-lock a user row whose conf still matches the system default (e.g. only isActive differs)", () => {
    res = {
      locals: {
        rows: [
          { name: "Default", locked: true, conf: { a: 1 }, isActive: true },
          { name: "Default", locked: false, conf: { a: 1 }, isActive: false },
        ],
      },
    };

    deduplicatePreferences(req, res, next);

    expect(res.locals.rows).toEqual([
      { name: "Default", locked: true, conf: { a: 1 }, isActive: false },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should keep a user row unlocked when its conf genuinely differs from the system default", () => {
    res = {
      locals: {
        rows: [
          { name: "Default", locked: true, conf: { a: 1 } },
          { name: "Default", locked: false, conf: { a: 2 } },
        ],
      },
    };

    deduplicatePreferences(req, res, next);

    expect(res.locals.rows).toEqual([
      { name: "Default", locked: false, conf: { a: 2 } },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should keep a locked row when no user override exists", () => {
    res = {
      locals: {
        rows: [{ name: "theme", locked: true, value: "light" }],
      },
    };

    deduplicatePreferences(req, res, next);

    expect(res.locals.rows).toEqual([
      { name: "theme", locked: true, value: "light" },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should keep unlocked rows with distinct names untouched", () => {
    res = {
      locals: {
        rows: [
          { name: "theme", locked: false },
          { name: "layout", locked: false },
        ],
      },
    };

    deduplicatePreferences(req, res, next);

    expect(res.locals.rows).toEqual([
      { name: "theme", locked: false },
      { name: "layout", locked: false },
    ]);
    expect(next).toHaveBeenCalledWith();
  });
});
