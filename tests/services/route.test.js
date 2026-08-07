/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeEntPath = path.join(__dirname, "../../src/entities/route.js");

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const select = jest.fn();
const deleteArchive = jest.fn();
jest.unstable_mockModule(routeEntPath, () => ({
  __esModule: true,
  default: { query: { select, deleteArchive } },
}));

describe("route service", () => {
  let routeSvc;
  const ORIGINAL_ENV = { ...process.env };

  beforeAll(async () => {
    const module = await import("../../src/services/route.js");
    routeSvc = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    select.mockReset();
    deleteArchive.mockReset();
    process.env.APP_NAME = "gatelin";
    process.env.ENV_NAME = "dev";
    process.env.SERVER_SCHEME = "http://";
    process.env.PORT = "3000";
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  async function initWithRows(rows) {
    select.mockReturnValue({ query: "SELECT", args: [] });
    execute.mockResolvedValue({ rows });
    await routeSvc.init();
  }

  describe("init", () => {
    it("should query only non-archived routes", async () => {
      await initWithRows([]);

      expect(select).toHaveBeenCalledWith(0, 0, "id", "ASC", {
        archived: { value: false, matchMode: "IS" },
      });
      expect(execute).toHaveBeenCalledWith("SELECT", [], null);
    });

    it("should build a base URL per unique service name from env vars", async () => {
      await initWithRows([
        { url: "/users", methodNames: ["GET"], serviceName: "user" },
      ]);

      expect(routeSvc.getServiceBaseUrl("user")).toBe(
        "http://gatelin-user-dev:3000",
      );
    });

    it("should default scheme and port when SERVER_SCHEME/PORT aren't set", async () => {
      delete process.env.SERVER_SCHEME;
      delete process.env.PORT;

      await initWithRows([
        { url: "/users", methodNames: ["GET"], serviceName: "user" },
      ]);

      expect(routeSvc.getServiceBaseUrl("user")).toBe(
        "http://gatelin-user-dev:3000",
      );
    });

    it("should ignore a route with no methodNames instead of throwing", async () => {
      await initWithRows([{ url: "/users", serviceName: "user" }]);

      expect(routeSvc.getOne("/users", "GET")).toBeUndefined();
    });

    it("should reset the previous route index on re-init", async () => {
      await initWithRows([
        { url: "/users", methodNames: ["GET"], serviceName: "user" },
      ]);
      expect(routeSvc.getOne("/users", "GET")).toBeDefined();

      await initWithRows([]);

      expect(routeSvc.getOne("/users", "GET")).toBeUndefined();
    });
  });

  describe("getOne", () => {
    it("should match a literal URL pattern for the right method", async () => {
      await initWithRows([
        { url: "/users", methodNames: ["GET"], serviceName: "user" },
      ]);

      expect(routeSvc.getOne("/users", "GET")).toMatchObject({ url: "/users" });
      expect(routeSvc.getOne("/users", "POST")).toBeUndefined();
    });

    it("should match a regex URL pattern", async () => {
      await initWithRows([
        { url: "/users/[0-9]+", methodNames: ["GET"], serviceName: "user" },
      ]);

      expect(routeSvc.getOne("/users/123", "GET")).toBeDefined();
      expect(routeSvc.getOne("/users/abc", "GET")).toBeUndefined();
    });

    it("should index a route under every method it accepts", async () => {
      await initWithRows([
        { url: "/users", methodNames: ["GET", "HEAD"], serviceName: "user" },
      ]);

      expect(routeSvc.getOne("/users", "GET")).toBeDefined();
      expect(routeSvc.getOne("/users", "HEAD")).toBeDefined();
    });

    it("should append to an existing method bucket when multiple routes share a method", async () => {
      await initWithRows([
        { url: "/users", methodNames: ["GET"], serviceName: "user" },
        { url: "/posts", methodNames: ["GET"], serviceName: "post" },
      ]);

      expect(routeSvc.getOne("/users", "GET")).toBeDefined();
      expect(routeSvc.getOne("/posts", "GET")).toBeDefined();
    });

    it("should strip the query string before matching", async () => {
      await initWithRows([
        { url: "/users", methodNames: ["GET"], serviceName: "user" },
      ]);

      expect(routeSvc.getOne("/users?page=2", "GET")).toBeDefined();
    });

    it("should normalize a trailing slash before matching", async () => {
      await initWithRows([
        { url: "/users", methodNames: ["GET"], serviceName: "user" },
      ]);

      expect(routeSvc.getOne("/users/", "GET")).toBeDefined();
    });

    it("should return undefined when no route accepts the given method", async () => {
      await initWithRows([]);

      expect(routeSvc.getOne("/users", "GET")).toBeUndefined();
    });

    it("should not double-anchor a pattern that already starts with ^", async () => {
      await initWithRows([
        { url: "^/users/[0-9]+", methodNames: ["GET"], serviceName: "user" },
      ]);

      expect(routeSvc.getOne("/users/123", "GET")).toBeDefined();
    });

    it("should not double-anchor a pattern that already ends with $", async () => {
      await initWithRows([
        { url: "/users/[0-9]+$", methodNames: ["GET"], serviceName: "user" },
      ]);

      expect(routeSvc.getOne("/users/123", "GET")).toBeDefined();
      expect(routeSvc.getOne("/users/123/extra", "GET")).toBeUndefined();
    });
  });

  describe("getServiceBaseUrl", () => {
    it("should return undefined for a service that has no routes", async () => {
      await initWithRows([]);

      expect(routeSvc.getServiceBaseUrl("ghost")).toBeUndefined();
    });
  });

  describe("deleteArchived", () => {
    it("should delete routes archived before the given date and return the row count", async () => {
      deleteArchive.mockReturnValue("DELETE FROM routes");
      execute.mockResolvedValue({ rowCount: 2 });
      const date = new Date("2026-01-01");

      const count = await routeSvc.deleteArchived(date);

      expect(execute).toHaveBeenCalledWith("DELETE FROM routes", [date], null);
      expect(count).toBe(2);
    });

    it("should return 0 when no rows are deleted", async () => {
      deleteArchive.mockReturnValue("DELETE FROM routes");
      execute.mockResolvedValue({ rowCount: 0 });

      expect(await routeSvc.deleteArchived(new Date())).toBe(0);
    });
  });
});
