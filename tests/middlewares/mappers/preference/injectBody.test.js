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
class MockSQLEntity {
  constructor(name, properties, schema) {
    this.name = name;
    this.properties = properties;
    this.schema = schema || "public";
    this.query = {
      select: jest
        .fn()
        .mockImplementation((first, rows, sortField, sortOrder, filters) => {
          return {
            query: `SELECT id, name, conf, locked FROM preferences WHERE resource = $1 AND ("locked" = $2 OR ("userId" = $3 AND "locked" = $4))`,
            args: [filters.resource.value, true, filters.userId.value, false],
          };
        }),
    };
  }
}
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({
  execute,
  SQLEntity: MockSQLEntity,
}));

/**
 * Routes the shared `execute` mock to canned results based on which query is
 * being run, since injectBody/finalizeSelection issue several distinct
 * queries (templates/existing personal rows merged, preference_selection upsert,
 * merged preferences view listing) in varying order depending on the code
 * path taken.
 */
function stubExecute({ templates = [], existing = [], merged = [] } = {}) {
  // Map templates so they have locked=true and existing so they have locked=false
  const allPrefs = [
    ...templates.map((t) => ({ ...t, locked: true })),
    ...existing.map((e) => ({ ...e, locked: false })),
  ];

  execute.mockImplementation((query) => {
    if (query.includes("INSERT INTO preference_selection"))
      return Promise.resolve({ rows: [] });
    if (/FROM preferences\s+WHERE/.test(query)) {
      // If it's querying for getTemplatesAndUserPreferences
      return Promise.resolve({ rows: allPrefs });
    }
    if (query.includes("FROM preferences"))
      return Promise.resolve({ rows: merged });
    if (query.includes("FROM preference_template"))
      return Promise.resolve({ rows: templates });
    if (query.includes("FROM preference WHERE"))
      return Promise.resolve({ rows: existing });
    return Promise.resolve({ rows: [] });
  });
}

describe("injectBody / finalizeSelection middlewares", () => {
  let injectBody, finalizeSelection;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../../src/middlewares/mappers/preference/injectBody.js"
    );
    injectBody = module.injectBody;
    finalizeSelection = module.finalizeSelection;
  });

  beforeEach(() => {
    execute.mockReset();
    stubExecute();
    res = {
      locals: { consumer: { userId: 11 } },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    req = { params: { resource: "dashboard" } };
    next = jest.fn();
  });

  describe("injectBody", () => {
    it("should create req.body when missing", async () => {
      req.body = undefined;
      req.body = { rows: [{ name: "a", conf: {} }] };

      await injectBody(req, res, next);

      expect(req.body).toBeDefined();
    });

    it("should call next with an error when rows is empty", async () => {
      req.body = { rows: [] };

      await injectBody(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 422,
        message: "Missing or empty preference rows",
      });
      expect(res.json).not.toHaveBeenCalled();
      expect(execute).not.toHaveBeenCalled();
    });

    it("should call next with an error when req.body.rows is missing entirely", async () => {
      req.body = {};

      await injectBody(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 422,
        message: "Missing or empty preference rows",
      });
      expect(res.json).not.toHaveBeenCalled();
      expect(execute).not.toHaveBeenCalled();
    });

    it("should inject userId/resource into personal rows, set conflictTarget, stash the pending selection target, and call next()", async () => {
      req.body = {
        rows: [
          { name: "theme", conf: { a: 1 }, isActive: false, locked: false },
          { name: "layout", conf: { b: 1 }, isActive: true, locked: false },
        ],
      };

      await injectBody(req, res, next);

      expect(req.body.rows).toEqual([
        { name: "theme", conf: { a: 1 }, userId: 11, resource: "dashboard" },
        { name: "layout", conf: { b: 1 }, userId: 11, resource: "dashboard" },
      ]);
      expect(req.body.conflictTarget).toEqual(["userId", "resource", "name"]);
      expect(res.locals.pendingSelectionTarget).toEqual({
        kind: "preference",
        name: "layout",
      });
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });

    it("should drop template rows unchanged from the template and not active, with no selection sync", async () => {
      stubExecute({
        templates: [{ id: 1, name: "Default", conf: { a: 1 } }],
      });
      req.body = {
        rows: [
          { name: "Default", conf: { a: 1 }, isActive: false, locked: true },
        ],
      };

      await injectBody(req, res, next);

      const selectionCalls = execute.mock.calls.filter(([q]) =>
        q.includes("INSERT INTO preference_selection"),
      );
      expect(selectionCalls).toHaveLength(0);
      expect(res.json).toHaveBeenCalledWith({ rows: [], total: 0 });
      expect(next).not.toHaveBeenCalled();
    });

    it("should sync preference_selection straight to the template (no fork) when only activating an unchanged template", async () => {
      stubExecute({
        templates: [{ id: 7, name: "Default", conf: { a: 1 } }],
        merged: [
          {
            id: 7,
            resource: "dashboard",
            name: "Default",
            conf: { a: 1 },
            locked: true,
            isActive: true,
          },
        ],
      });
      req.body = {
        rows: [
          { name: "Default", conf: { a: 1 }, isActive: true, locked: true },
        ],
      };

      await injectBody(req, res, next);

      const [, args] = execute.mock.calls.find(([q]) =>
        q.includes("INSERT INTO preference_selection"),
      );
      expect(args).toEqual([11, "dashboard", 7, null]);
      expect(res.json).toHaveBeenCalledWith({
        rows: [
          {
            id: 7,
            resource: "dashboard",
            name: "Default",
            conf: { a: 1 },
            locked: true,
            isActive: true,
          },
        ],
        total: 1,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fork a template row under a new '(copy)' name when its conf actually changed", async () => {
      stubExecute({
        templates: [
          {
            id: 7,
            name: "Default",
            conf: [{ key: "core", isVisible: true, defaultWidth: "60px" }],
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
          userId: 11,
          resource: "dashboard",
        },
      ]);
      expect(res.locals.pendingSelectionTarget).toEqual({
        kind: "preference",
        name: "Default (copy)",
      });
      expect(next).toHaveBeenCalledWith();
    });

    it("should append a numeric suffix when the auto-generated copy name is already taken", async () => {
      stubExecute({
        templates: [
          {
            id: 7,
            name: "Default",
            conf: [{ key: "core", isVisible: true, defaultWidth: "60px" }],
          },
        ],
        existing: [{ id: 42, name: "Default (copy)" }],
      });
      req.body = {
        rows: [
          {
            name: "Default",
            conf: [{ key: "core", isVisible: true, defaultWidth: "120px" }],
            isActive: false,
            locked: true,
          },
        ],
      };

      await injectBody(req, res, next);

      expect(req.body.rows).toEqual([
        {
          name: "Default (copy 2)",
          conf: [{ key: "core", isVisible: true, defaultWidth: "120px" }],
          userId: 11,
          resource: "dashboard",
        },
      ]);
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next(err) when the templates/existing rows query fails", async () => {
      const err = new Error("db error");
      execute.mockReset();
      execute.mockRejectedValue(err);
      req.body = { rows: [{ name: "Default", locked: true }] };

      await injectBody(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });

    it("should call next(err) when the preference_selection upsert fails on the no-upsert path", async () => {
      const err = new Error("selection failed");
      execute.mockImplementation((query) => {
        if (/FROM preferences\s+WHERE/.test(query))
          return Promise.resolve({
            rows: [{ id: 7, name: "Default", conf: { a: 1 }, locked: true }],
          });
        if (query.includes("INSERT INTO preference_selection"))
          return Promise.reject(err);
        return Promise.resolve({ rows: [] });
      });
      req.body = {
        rows: [
          { name: "Default", conf: { a: 1 }, isActive: true, locked: true },
        ],
      };

      await injectBody(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("finalizeSelection", () => {
    beforeEach(() => {
      res.locals.rows = [];
    });

    it("should skip preference_selection sync and just refresh merged rows when there is no pending target", async () => {
      res.locals.pendingSelectionTarget = null;
      stubExecute({
        merged: [
          {
            id: 1,
            resource: "dashboard",
            name: "Default",
            conf: {},
            locked: true,
            isActive: true,
          },
        ],
      });

      await finalizeSelection(req, res, next);

      const selectionCalls = execute.mock.calls.filter(([q]) =>
        q.includes("INSERT INTO preference_selection"),
      );
      expect(selectionCalls).toHaveLength(0);
      expect(res.locals.rows).toEqual([
        {
          id: 1,
          resource: "dashboard",
          name: "Default",
          conf: {},
          locked: true,
          isActive: true,
        },
      ]);
      expect(res.locals.total).toBe(1);
      expect(next).toHaveBeenCalledWith();
    });

    it("should sync preference_selection to a template target", async () => {
      res.locals.pendingSelectionTarget = { kind: "template", id: 7 };
      stubExecute({
        merged: [
          {
            id: 7,
            resource: "dashboard",
            name: "Default",
            conf: {},
            locked: true,
            isActive: true,
          },
        ],
      });

      await finalizeSelection(req, res, next);

      const [, args] = execute.mock.calls.find(([q]) =>
        q.includes("INSERT INTO preference_selection"),
      );
      expect(args).toEqual([11, "dashboard", 7, null]);
      expect(next).toHaveBeenCalledWith();
    });

    it("should resolve the forked/upserted row's generated id by name for a preference target", async () => {
      res.locals.pendingSelectionTarget = {
        kind: "preference",
        name: "Default (copy)",
      };
      res.locals.rows = [{ id: 99, name: "Default (copy)" }];
      stubExecute({
        merged: [
          {
            id: 99,
            resource: "dashboard",
            name: "Default (copy)",
            conf: {},
            locked: false,
            isActive: true,
          },
        ],
      });

      await finalizeSelection(req, res, next);

      const [, args] = execute.mock.calls.find(([q]) =>
        q.includes("INSERT INTO preference_selection"),
      );
      expect(args).toEqual([11, "dashboard", null, 99]);
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next(err) when the preference_selection upsert fails", async () => {
      const err = new Error("selection failed");
      res.locals.pendingSelectionTarget = { kind: "template", id: 7 };
      execute.mockImplementation((query) => {
        if (query.includes("INSERT INTO preference_selection"))
          return Promise.reject(err);
        return Promise.resolve({ rows: [] });
      });

      await finalizeSelection(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
