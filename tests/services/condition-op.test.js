/**
 * @jest-environment node
 */

import conditionOpSvc from "../../src/services/condition-op.js";

// Snapshot of the currently-supported ops. Kept alongside the service so a
// getAll() assertion can pin the exact shape rather than only proving each op
// individually via isAllowed. Whenever the service constant changes to match
// db/liquibase/gatelin/versions/03-struct/14-condition.sql, update this too.
const DB_CHK_CONDITION_OP = new Set(["=", "!=", "<", ">", "<=", ">="]);

describe("condition-op service", () => {
  describe("isAllowed", () => {
    it.each([["="], ["!="], ["<"], ["<="], [">"], [">="]])(
      "returns true for DB-allowed op %p",
      (op) => {
        expect(conditionOpSvc.isAllowed(op)).toBe(true);
      },
    );

    it.each([
      ["LIKE"],
      ["ILIKE"],
      ["IS"],
      ["IS NOT"],
      ["<>"],
      ["IN"],
      ["NOT IN"],
      ["&&"],
      [""],
      [" ="], // whitespace-prefixed: exact match, no trim
    ])("returns false for disallowed op %p", (op) => {
      expect(conditionOpSvc.isAllowed(op)).toBe(false);
    });

    it.each([[undefined], [null], [42], [true], [{}], [[]], [Symbol("=")]])(
      "returns false for non-string op %p",
      (op) => {
        // Guards the `typeof op === "string"` short-circuit — must not throw,
        // must not delegate to Set.has's default coercion.
        expect(conditionOpSvc.isAllowed(op)).toBe(false);
      },
    );
  });

  describe("getAll", () => {
    it("returns the full DB-allowed set", () => {
      expect(conditionOpSvc.getAll()).toEqual(DB_CHK_CONDITION_OP);
    });

    it("returns a fresh copy so external mutation cannot poison the source", () => {
      const snapshot = conditionOpSvc.getAll();
      snapshot.add("LIKE");
      snapshot.delete("=");

      // The internal set must be untouched — verified through both isAllowed
      // (the read path callers actually use) and a second getAll (to prove
      // the source of truth is intact, not just the last snapshot).
      expect(conditionOpSvc.isAllowed("=")).toBe(true);
      expect(conditionOpSvc.isAllowed("LIKE")).toBe(false);
      expect(conditionOpSvc.getAll()).toEqual(DB_CHK_CONDITION_OP);
    });

    it("returns a distinct object reference on each call", () => {
      // Not the same identity between two calls — otherwise a caller
      // mutating the returned Set would poison every subsequent caller.
      expect(conditionOpSvc.getAll()).not.toBe(conditionOpSvc.getAll());
    });
  });
});
