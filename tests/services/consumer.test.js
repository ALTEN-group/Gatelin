/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const consumerEntPath = path.join(__dirname, "../../src/entities/consumer.js");

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

const getCache = jest.fn();
jest.unstable_mockModule(consumerEntPath, () => ({
  __esModule: true,
  default: { getCache },
}));

describe("consumer service", () => {
  let consumerSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/consumer.js");
    consumerSvc = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    executeJob.mockReset();
    getCache.mockReset();
  });

  async function initWithRows(rows) {
    getCache.mockResolvedValue(rows);
    await consumerSvc.init();
  }

  describe("init", () => {
    it("should query only non-archived consumers and index them by token and id", async () => {
      await initWithRows([
        { id: 1, accessToken: "tok1", refreshToken: "ref1", roles: [1] },
      ]);

      expect(getCache).toHaveBeenCalledWith();
      expect(consumerSvc.getOne("tok1")).toMatchObject({ id: 1 });
    });
  });

  describe("getOne", () => {
    it("should return undefined for an unknown access token", async () => {
      await initWithRows([]);

      expect(consumerSvc.getOne("nope")).toBeUndefined();
    });
  });

  describe("getByRefreshToken", () => {
    it("should index consumers by refresh token at init", async () => {
      await initWithRows([
        { id: 1, accessToken: "tok1", refreshToken: "ref1", roles: [1] },
      ]);

      expect(consumerSvc.getByRefreshToken("ref1")).toMatchObject({ id: 1 });
    });

    it("should return undefined for an unknown refresh token", async () => {
      await initWithRows([]);

      expect(consumerSvc.getByRefreshToken("nope")).toBeUndefined();
    });
  });

  describe("addToCache", () => {
    it("should add a consumer copy indexed by both token and id", async () => {
      await initWithRows([]);

      const consumer = {
        id: 5,
        accessToken: "tokA",
        refreshToken: "refA",
        roles: [],
      };
      consumerSvc.addToCache(consumer);

      const cached = consumerSvc.getOne("tokA");
      expect(cached).toEqual(consumer);
      expect(cached).not.toBe(consumer);
      expect(consumerSvc.getByRefreshToken("refA")).toEqual(consumer);
    });
  });

  describe("updateCache", () => {
    it("should move a consumer to its new access token and update roles", async () => {
      await initWithRows([]);
      consumerSvc.addToCache({
        id: 5,
        accessToken: "old",
        refreshToken: "oldRef",
        roles: [1],
      });

      const updated = consumerSvc.updateCache(5, "new", "newRef", [2, 3]);

      expect(updated).toBe(true);
      expect(consumerSvc.getOne("old")).toBeUndefined();
      expect(consumerSvc.getOne("new")).toMatchObject({
        id: 5,
        accessToken: "new",
        refreshToken: "newRef",
        roles: [2, 3],
      });
      expect(consumerSvc.getByRefreshToken("oldRef")).toBeUndefined();
      expect(consumerSvc.getByRefreshToken("newRef")).toMatchObject({
        id: 5,
      });
    });

    it("should return false when updating an id that isn't cached", async () => {
      await initWithRows([]);

      expect(consumerSvc.updateCache(999, "x", "y", [])).toBe(false);
    });
  });

  describe("deleteFromCache", () => {
    it("should remove a consumer from both indexes", async () => {
      await initWithRows([]);
      consumerSvc.addToCache({
        id: 7,
        accessToken: "tokZ",
        refreshToken: "refZ",
        roles: [],
      });

      consumerSvc.deleteFromCache(7);

      expect(consumerSvc.getOne("tokZ")).toBeUndefined();
      expect(consumerSvc.getByRefreshToken("refZ")).toBeUndefined();
    });

    it("should be a no-op when deleting an id that isn't cached", async () => {
      await initWithRows([]);

      expect(() => consumerSvc.deleteFromCache(999)).not.toThrow();
    });
  });

  describe("deleteArchived", () => {
    it("should hard-delete archived consumers via the job pool", async () => {
      executeJob.mockResolvedValue({ rows: [{ count: 4 }] });
      const date = new Date("2026-01-01");

      const count = await consumerSvc.deleteArchived(date);

      expect(executeJob).toHaveBeenCalledWith(
        "SELECT delete($1, $2, $3) AS count",
        ["public", "consumer", date],
      );
      expect(count).toBe(4);
    });

    it("should return 0 when no rows are deleted", async () => {
      executeJob.mockResolvedValue({ rows: [{ count: 0 }] });

      expect(await consumerSvc.deleteArchived(new Date())).toBe(0);
    });
  });
});
