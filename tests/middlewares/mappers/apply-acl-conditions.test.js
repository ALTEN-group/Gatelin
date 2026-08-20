/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const conditionOpSvcPath = path.join(
  __dirname,
  "../../../src/services/condition-op.js",
);

// The condition-op service exposes a static allowlist (const module-level
// Set, kept in sync with db/liquibase/gatelin/versions/03-struct/14-condition.sql
// — see the service's docblock for rationale). Here we replace it with a
// controlled fake so we can (a) test each mapping case in isolation and
// (b) exercise the fail-closed path with a synthetic disallowed op without
// pinning the middleware suite to the current 6-element real set.
const isAllowed = jest.fn();
const getAll = jest.fn(() => new Set());
jest.unstable_mockModule(conditionOpSvcPath, () => ({
  __esModule: true,
  default: { isAllowed, getAll },
}));

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}));

const DB_ALLOWED_OPS = new Set(["=", "!=", "<", ">", "<=", ">="]);

describe("applyAclConditions middleware", () => {
  let applyAclConditions;
  let routeEntity;
  let log;
  let req, res, next;

  beforeAll(async () => {
    ({ log } = await import("@dwtechs/winstan"));
    ({ default: applyAclConditions } = await import(
      "../../../src/middlewares/mappers/apply-acl-conditions.js"
    ));
    ({ default: routeEntity } = await import("../../../src/entities/route.js"));
  });

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
    // Default: fake the service as if it had loaded the real DB CHECK
    // (chk_condition_op) — accepting the six SQL operator symbols and
    // rejecting anything else. Individual tests can override.
    isAllowed.mockImplementation((op) => DB_ALLOWED_OPS.has(op));
  });

  describe("no-op paths", () => {
    it("should call next() and leave req.body untouched when req.aclConditions is undefined", () => {
      applyAclConditions(req, res, next);

      expect(req.body).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next() and leave req.body untouched when req.aclConditions is empty", () => {
      req.aclConditions = [];

      applyAclConditions(req, res, next);

      expect(req.body).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("op → matchMode mapping", () => {
    // Inputs mirror what /db/liquibase/gatelin/versions/03-struct/14-condition.sql
    // allows in chk_condition_op and what the role_cache view emits.
    it.each([
      ["=", "="],
      ["!=", "!="],
      ["<", "<"],
      ["<=", "<="],
      [">", ">"],
      [">=", ">="],
    ])(
      "emits { value, matchMode } forwarding DB op '%s' unchanged",
      (op, expectedMatchMode) => {
        req.aclConditions = [{ field: "archived", op, value: "false" }];

        applyAclConditions(req, res, next);

        expect(req.body.filters).toEqual({
          archived: [
            {
              value: "false",
              matchMode: expectedMatchMode,
              operator: "AND",
            },
          ],
        });
        expect(req.body.operator).toBe("AND");
        expect(next).toHaveBeenCalledWith();
      },
    );

    it("creates req.body and req.body.filters if they are missing", () => {
      req.aclConditions = [{ field: "archived", op: "=", value: "false" }];

      applyAclConditions(req, res, next);

      expect(req.body).toBeDefined();
      expect(req.body.filters).toBeDefined();
    });

    it("preserves unrelated req.body.filters and appends the ACL-scoped ones", () => {
      req.body = {
        filters: { name: [{ value: "cap", matchMode: "contains" }] },
      };
      req.aclConditions = [
        { field: "archived", op: "=", value: "false" },
        { field: "coreOnly", op: "!=", value: "true" },
      ];

      applyAclConditions(req, res, next);

      expect(req.body.filters).toEqual({
        name: [{ value: "cap", matchMode: "contains" }],
        archived: [{ value: "false", matchMode: "=", operator: "AND" }],
        coreOnly: [{ value: "true", matchMode: "!=", operator: "AND" }],
      });
      expect(req.body.operator).toBe("AND");
      expect(next).toHaveBeenCalledWith();
    });

    it("forces caller OR filters on the same field to AND", () => {
      req.body = {
        operator: "OR",
        filters: {
          archived: { value: true, matchMode: "=", operator: "OR" },
        },
      };
      req.aclConditions = [{ field: "archived", op: "=", value: false }];

      applyAclConditions(req, res, next);

      expect(req.body.operator).toBe("AND");
      expect(req.body.filters.archived).toEqual([
        { value: true, matchMode: "=", operator: "AND" },
        { value: false, matchMode: "=", operator: "AND" },
      ]);
    });
  });

  describe("fail-closed behavior", () => {
    // Any op the condition-op service rejects (either because it isn't in
    // the DB CHECK today, or because a future migration widens the CHECK
    // without updating the service) must reject the request.
    it.each([["LIKE"], ["IS"], ["<>"], [""], [undefined], [null]])(
      "rejects conditions with unsupported op %p and logs a warning",
      (op) => {
        req.aclConditions = [{ field: "archived", op, value: "false" }];

        applyAclConditions(req, res, next);

        expect(req.body.filters).toEqual({});
        expect(log.warn).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({
          statusCode: 403,
          message: "Unsupported ACL condition",
        });
      },
    );

    it("rejects a mixed batch when any condition is invalid", () => {
      req.aclConditions = [
        { field: "archived", op: "=", value: "false" },
        { field: "coreOnly", op: "LIKE", value: "%bogus%" },
        { field: "userId", op: ">=", value: "10" },
      ];

      applyAclConditions(req, res, next);

      expect(req.body.filters).toEqual({
        archived: [{ value: "false", matchMode: "=", operator: "AND" }],
      });
      expect(log.warn).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith({
        statusCode: 403,
        message: "Unsupported ACL condition",
      });
    });

    it("asks the service on every request (no local caching in the middleware)", () => {
      // Guards against a future optimization that caches isAllowed's answer
      // inside the middleware closure. If someone later swaps condition-op's
      // constant for a mutable/reload-able source, the middleware must still
      // ask fresh on every request rather than snapshot at first call.
      req.aclConditions = [{ field: "archived", op: "=", value: "false" }];

      isAllowed.mockReturnValueOnce(true);
      applyAclConditions(req, res, next);
      expect(req.body.filters).toEqual({
        archived: [{ value: "false", matchMode: "=", operator: "AND" }],
      });

      req = {};
      isAllowed.mockReturnValueOnce(false);
      req.aclConditions = [{ field: "archived", op: "=", value: "false" }];
      const invalidNext = jest.fn();
      applyAclConditions(req, res, invalidNext);
      expect(req.body.filters).toEqual({});
      expect(invalidNext).toHaveBeenCalledWith({
        statusCode: 403,
        message: "Unsupported ACL condition",
      });
    });
  });

  // Regression test for the audit finding:
  //   "Role-scoped ACL conditions are silently dropped (broken access control)"
  // Before the fix, applyAclConditions emitted { value, op } while
  // @dwtechs/antity-pgsql destructures { value, matchMode } — resulting in
  // mapComparator(undefined) → null → the WHERE fragment vanished.
  // This suite pins the actual generated SQL to prevent regression.
  describe("regression: generated SQL WHERE clause for a scoped role", () => {
    it("produces WHERE archived = $1 for the 'Non-archived only' condition on routes/search", () => {
      req.aclConditions = [{ field: "archived", op: "=", value: "false" }];

      applyAclConditions(req, res, next);

      const { query, args } = routeEntity.query.select(
        0,
        25,
        "id",
        "ASC",
        req.body.filters,
      );

      expect(query).toMatch(/WHERE\s+"?archived"?\s*=\s*\$1/i);
      expect(args).toContain("false");
    });

    it("produces WHERE archived <> $1 for a role scoped with op '!='", () => {
      req.aclConditions = [{ field: "archived", op: "!=", value: "true" }];

      applyAclConditions(req, res, next);

      const { query, args } = routeEntity.query.select(
        0,
        25,
        "id",
        "ASC",
        req.body.filters,
      );

      // "!=" is normalized to "<>" by @dwtechs/antity-pgsql's mapComparator
      // (added in 0.21.5). Before this fix, the WHERE clause was empty.
      expect(query).toMatch(/WHERE\s+"?archived"?\s*<>\s*\$1/i);
      expect(args).toContain("true");
    });

    it("rejects before querying when the only ACL condition has an unsupported op", () => {
      req.aclConditions = [
        { field: "archived", op: "LIKE", value: "%anything%" },
      ];

      applyAclConditions(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 403,
        message: "Unsupported ACL condition",
      });
    });
  });
});
