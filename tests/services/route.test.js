/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeEntPath = path.join(__dirname, "../../src/entities/route.js");

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

const getCache = jest.fn();
jest.unstable_mockModule(routeEntPath, () => ({
  __esModule: true,
  default: { getCache },
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
    executeJob.mockReset();
    getCache.mockReset();
    process.env.APP_NAME = "gatelin";
    process.env.ENV_NAME = "dev";
    process.env.SERVER_SCHEME = "http://";
    process.env.PORT = "3000";
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  async function initWithRows(rows) {
    getCache.mockResolvedValue(rows);
    await routeSvc.init();
  }

  describe("init", () => {
    it("should load routes via getCache", async () => {
      await initWithRows([]);

      expect(getCache).toHaveBeenCalledWith();
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
    it("should hard-delete archived routes via the job pool", async () => {
      executeJob.mockResolvedValue({ rows: [{ count: 2 }] });
      const date = new Date("2026-01-01");

      const count = await routeSvc.deleteArchived(date);

      expect(executeJob).toHaveBeenCalledWith(
        "SELECT delete($1, $2, $3) AS count",
        ["public", "route", date],
      );
      expect(count).toBe(2);
    });

    it("should return 0 when no rows are deleted", async () => {
      executeJob.mockResolvedValue({ rows: [{ count: 0 }] });

      expect(await routeSvc.deleteArchived(new Date())).toBe(0);
    });
  });
});
