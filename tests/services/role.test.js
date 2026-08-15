/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const roleEntPath = path.join(__dirname, "../../src/entities/role.js");
const roleCacheEntPath = path.join(
  __dirname,
  "../../src/entities/role-cache.js",
);

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const deleteArchive = jest.fn();
jest.unstable_mockModule(roleEntPath, () => ({
  __esModule: true,
  default: { query: { deleteArchive } },
}));

const getCache = jest.fn();
jest.unstable_mockModule(roleCacheEntPath, () => ({
  __esModule: true,
  default: { getCache },
}));

describe("role service", () => {
  let roleSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/role.js");
    roleSvc = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    getCache.mockReset();
    deleteArchive.mockReset();
  });

  async function initWithRows(rows) {
    getCache.mockResolvedValue(rows);
    await roleSvc.init();
  }

  describe("init", () => {
    it("should load roles via getCache from the role_cache view", async () => {
      await initWithRows([{ id: 1, name: "admin", permissions: [] }]);

      expect(getCache).toHaveBeenCalledWith();
      expect(roleSvc.getOne(1)).toMatchObject({ id: 1, name: "admin" });
    });

    it("should index permissions by route id with a fields Set when fields are present", async () => {
      await initWithRows([
        {
          id: 1,
          name: "admin",
          permissions: [{ route: 10, operation: 1, fields: ["a", "b"] }],
        },
      ]);

      const permission = roleSvc.getOne(1).permissions.get(10);
      expect(permission._fieldsSet).toEqual(new Set(["a", "b"]));
    });

    it("should leave _fieldsSet null when a permission has no fields", async () => {
      await initWithRows([
        {
          id: 1,
          name: "admin",
          permissions: [{ route: 10, operation: 1, fields: null }],
        },
      ]);

      expect(roleSvc.getOne(1).permissions.get(10)._fieldsSet).toBeNull();
    });

    it("should default to an empty permissions map when a role has none", async () => {
      await initWithRows([{ id: 2, name: "guest" }]);

      expect(roleSvc.getOne(2).permissions.size).toBe(0);
    });
  });

  describe("getOne", () => {
    it("should return undefined for an unknown role id", async () => {
      await initWithRows([]);

      expect(roleSvc.getOne(999)).toBeUndefined();
    });
  });

  describe("deleteArchived", () => {
    it("should delete roles (not role_cache) archived before the given date and return the row count", async () => {
      deleteArchive.mockReturnValue("DELETE FROM roles");
      execute.mockResolvedValue({ rowCount: 1 });
      const date = new Date("2026-01-01");

      const count = await roleSvc.deleteArchived(date);

      expect(execute).toHaveBeenCalledWith("DELETE FROM roles", [date], null);
      expect(count).toBe(1);
    });

    it("should return 0 when no rows are deleted", async () => {
      deleteArchive.mockReturnValue("DELETE FROM roles");
      execute.mockResolvedValue({ rowCount: 0 });

      expect(await roleSvc.deleteArchived(new Date())).toBe(0);
    });
  });
});
