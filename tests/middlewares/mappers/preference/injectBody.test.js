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

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

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
    execute.mockReset();
    execute.mockResolvedValue({ rows: [] });
    res = {
      locals: { consumer: { userId: 11 } },
      json: jest.fn(),
    };
    req = { params: { resource: "dashboard" } };
    next = jest.fn();
  });

  it("should create req.body when missing", async () => {
    req.body = undefined;
    req.body = { rows: [{ name: "a" }] };

    await injectBody(req, res, next);

    expect(req.body).toBeDefined();
  });

  it("should respond directly with empty rows when rows is empty, without calling next()", async () => {
    req.body = { rows: [] };

    await injectBody(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ rows: [] });
    expect(next).not.toHaveBeenCalled();
    expect(execute).not.toHaveBeenCalled();
  });

  it("should respond directly when req.body.rows is missing entirely", async () => {
    req.body = {};

    await injectBody(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ rows: [] });
    expect(next).not.toHaveBeenCalled();
  });

  it("should inject userId and resource into each row, set conflictTarget, and call next()", async () => {
    req.body = {
      rows: [
        { name: "theme", value: "dark" },
        { name: "layout", value: "grid" },
      ],
    };

    await injectBody(req, res, next);

    expect(req.body.rows).toEqual([
      { name: "theme", value: "dark", userId: 11, resource: "dashboard" },
      { name: "layout", value: "grid", userId: 11, resource: "dashboard" },
    ]);
    expect(req.body.conflictTarget).toEqual(["userId", "resource", "name"]);
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it("should drop locked rows that are unchanged from the system default", async () => {
    execute.mockResolvedValue({
      rows: [{ userId: -1, name: "Default", conf: { a: 1 }, isActive: true }],
    });
    req.body = {
      rows: [{ name: "Default", conf: { a: 1 }, isActive: true, locked: true }],
    };

    await injectBody(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ rows: [] });
    expect(next).not.toHaveBeenCalled();
  });

  it("should keep locked rows whose isActive differs from the system default under the SAME name (activating a preset, not a customization)", async () => {
    execute.mockResolvedValue({
      rows: [{ userId: -1, name: "Default", conf: { a: 1 }, isActive: false }],
    });
    req.body = {
      rows: [{ name: "Default", conf: { a: 1 }, isActive: true, locked: true }],
    };

    await injectBody(req, res, next);

    expect(req.body.rows).toEqual([
      {
        name: "Default",
        conf: { a: 1 },
        isActive: true,
        locked: true,
        userId: 11,
        resource: "dashboard",
      },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should always keep non-locked (user-owned) rows regardless of the system default", async () => {
    execute.mockResolvedValue({
      rows: [{ name: "Custom", conf: { a: 1 }, isActive: true }],
    });
    req.body = {
      rows: [{ name: "Custom", conf: { a: 1 }, isActive: true, locked: false }],
    };

    await injectBody(req, res, next);

    expect(req.body.rows).toEqual([
      {
        name: "Custom",
        conf: { a: 1 },
        isActive: true,
        locked: false,
        userId: 11,
        resource: "dashboard",
      },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should fork a locked row under a new '(copy)' name when defaultWidth differs (e.g. a column resize)", async () => {
    execute.mockResolvedValue({
      rows: [
        {
          userId: -1,
          name: "Default",
          conf: [{ key: "core", isVisible: true, defaultWidth: "60px" }],
          isActive: true,
        },
      ],
    });
    req.body = {
      rows: [
        {
          name: "Default",
          conf: [{ key: "core", isVisible: true, defaultWidth: "120px" }],
          isActive: true,
          locked: true,
        },
      ],
    };

    await injectBody(req, res, next);

    expect(req.body.rows).toEqual([
      {
        name: "Default (copy)",
        conf: [{ key: "core", isVisible: true, defaultWidth: "120px" }],
        isActive: true,
        locked: true,
        userId: 11,
        resource: "dashboard",
      },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should fork a locked row under a new '(copy)' name when isVisible actually changed", async () => {
    execute.mockResolvedValue({
      rows: [
        {
          userId: -1,
          name: "Default",
          conf: [{ key: "core", isVisible: true, defaultWidth: "60px" }],
          isActive: true,
        },
      ],
    });
    req.body = {
      rows: [
        {
          name: "Default",
          conf: [{ key: "core", isVisible: false }],
          isActive: true,
          locked: true,
        },
      ],
    };

    await injectBody(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.rows).toEqual([
      {
        name: "Default (copy)",
        conf: [{ key: "core", isVisible: false }],
        isActive: true,
        locked: true,
        userId: 11,
        resource: "dashboard",
      },
    ]);
  });

  it("should append a numeric suffix when the auto-generated copy name is already taken", async () => {
    execute.mockResolvedValue({
      rows: [
        {
          userId: -1,
          name: "Default",
          conf: [{ key: "core", isVisible: true, defaultWidth: "60px" }],
          isActive: true,
        },
        {
          userId: 11,
          name: "Default (copy)",
          conf: [{ key: "core", isVisible: false }],
          isActive: false,
        },
      ],
    });
    req.body = {
      rows: [
        {
          name: "Default",
          conf: [{ key: "core", isVisible: true, defaultWidth: "120px" }],
          isActive: true,
          locked: true,
        },
      ],
    };

    await injectBody(req, res, next);

    expect(req.body.rows).toEqual([
      {
        name: "Default (copy 2)",
        conf: [{ key: "core", isVisible: true, defaultWidth: "120px" }],
        isActive: true,
        locked: true,
        userId: 11,
        resource: "dashboard",
      },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(err) when the system defaults query fails", async () => {
    const err = new Error("db error");
    execute.mockRejectedValue(err);
    req.body = { rows: [{ name: "Default", locked: true }] };

    await injectBody(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
