/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scopeEntPath = path.join(__dirname, "../../src/entities/scope.js");

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

const getCache = jest.fn();
jest.unstable_mockModule(scopeEntPath, () => ({
  __esModule: true,
  default: { getCache },
}));

describe("scope service", () => {
  let scopeSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/scope.js");
    scopeSvc = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    executeJob.mockReset();
    getCache.mockReset();
  });

  async function initWithRows(rows) {
    getCache.mockResolvedValue(rows);
    await scopeSvc.init();
  }

  describe("init", () => {
    it("should load scopes via getCache", async () => {
      await initWithRows([{ id: 1, name: "own" }]);

      expect(getCache).toHaveBeenCalledWith();
    });
  });

  describe("getValues", () => {
    it("should resolve scope ids to their names", async () => {
      await initWithRows([
        { id: 1, name: "own" },
        { id: 2, name: "team" },
      ]);

      expect(scopeSvc.getValues([1, 2])).toEqual(["own", "team"]);
    });

    it("should skip ids that have no matching cached scope", async () => {
      await initWithRows([{ id: 1, name: "own" }]);

      expect(scopeSvc.getValues([1, 999])).toEqual(["own"]);
    });

    it("should return an empty array for an empty input", async () => {
      await initWithRows([]);

      expect(scopeSvc.getValues([])).toEqual([]);
    });
  });

  describe("deleteArchived", () => {
    it("should hard-delete archived scopes via the job pool", async () => {
      executeJob.mockResolvedValue({ rows: [{ count: 2 }] });
      const date = new Date("2026-01-01");

      const count = await scopeSvc.deleteArchived(date);

      expect(executeJob).toHaveBeenCalledWith(
        "SELECT delete($1, $2, $3) AS count",
        ["public", "scope", date],
      );
      expect(count).toBe(2);
    });

    it("should return 0 when no rows are deleted", async () => {
      executeJob.mockResolvedValue({ rows: [{ count: 0 }] });

      expect(await scopeSvc.deleteArchived(new Date())).toBe(0);
    });
  });
});
