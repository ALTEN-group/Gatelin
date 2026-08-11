/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corsEntPath = path.join(__dirname, "../../src/entities/cors.js");

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const select = jest.fn();
const deleteArchive = jest.fn();
jest.unstable_mockModule(corsEntPath, () => ({
	__esModule: true,
	default: { query: { select, deleteArchive } },
}));

describe("cors service", () => {
	let corsSvc;

	beforeAll(async () => {
		const module = await import("../../src/services/cors.js");
		corsSvc = module.default;
	});

	beforeEach(() => {
		execute.mockReset();
		select.mockReset();
		deleteArchive.mockReset();
	});

	describe("init", () => {
		it("should load non-archived origins into the cache", async () => {
			select.mockReturnValue({ query: "SELECT", args: ["a"] });
			execute.mockResolvedValue({
				rows: [{ id: 1, name: "http://a.example.com", credentials: true }],
			});

			await corsSvc.init();

			expect(select).toHaveBeenCalledWith(0, 0, "id", "ASC", {
				archived: { value: false, matchMode: "IS" },
			});
			expect(execute).toHaveBeenCalledWith("SELECT", ["a"], null);
			expect(corsSvc.has("http://a.example.com")).toBe(true);
			expect(corsSvc.getCredentials("http://a.example.com")).toBe(true);
		});

		it("should clear any previously cached origins that are no longer returned", async () => {
			select.mockReturnValue({ query: "SELECT", args: [] });
			execute.mockResolvedValue({
				rows: [{ id: 1, name: "http://a.example.com", credentials: false }],
			});
			await corsSvc.init();

			execute.mockResolvedValue({ rows: [] });
			await corsSvc.init();

			expect(corsSvc.has("http://a.example.com")).toBe(false);
		});
	});

	describe("has / getCredentials", () => {
		beforeEach(async () => {
			select.mockReturnValue({ query: "SELECT", args: [] });
			execute.mockResolvedValue({
				rows: [{ id: 1, name: "http://a.example.com", credentials: false }],
			});
			await corsSvc.init();
		});

		it("should return false for an origin that isn't cached", () => {
			expect(corsSvc.has("http://unknown.example.com")).toBe(false);
		});

		it("should default getCredentials to false for an unknown origin", () => {
			expect(corsSvc.getCredentials("http://unknown.example.com")).toBe(false);
		});
	});

	describe("addToCache / updateCache / deleteFromCache", () => {
		beforeEach(async () => {
			select.mockReturnValue({ query: "SELECT", args: [] });
			execute.mockResolvedValue({ rows: [] });
			await corsSvc.init();
		});

		it("should add a new origin to the cache", () => {
			corsSvc.addToCache({
				id: 2,
				name: "http://b.example.com",
				credentials: true,
			});

			expect(corsSvc.has("http://b.example.com")).toBe(true);
			expect(corsSvc.getCredentials("http://b.example.com")).toBe(true);
		});

		it("should rename a cached origin and preserve its credentials flag", () => {
			corsSvc.addToCache({
				id: 2,
				name: "http://old.example.com",
				credentials: true,
			});

			const updated = corsSvc.updateCache(2, "http://new.example.com");

			expect(updated).toBe(true);
			expect(corsSvc.has("http://old.example.com")).toBe(false);
			expect(corsSvc.has("http://new.example.com")).toBe(true);
			expect(corsSvc.getCredentials("http://new.example.com")).toBe(true);
		});

		it("should return false when updating an id that isn't cached", () => {
			expect(corsSvc.updateCache(999, "http://ghost.example.com")).toBe(false);
		});

		it("should remove an origin from the cache", () => {
			corsSvc.addToCache({
				id: 3,
				name: "http://c.example.com",
				credentials: false,
			});

			corsSvc.deleteFromCache(3);

			expect(corsSvc.has("http://c.example.com")).toBe(false);
		});

		it("should be a no-op when deleting an id that isn't cached", () => {
			expect(() => corsSvc.deleteFromCache(999)).not.toThrow();
		});
	});

	describe("deleteArchived", () => {
		it("should delete origins archived before the given date and return the row count", async () => {
			deleteArchive.mockReturnValue("DELETE FROM cors");
			execute.mockResolvedValue({ rowCount: 3 });
			const date = new Date("2026-01-01");

			const count = await corsSvc.deleteArchived(date);

			expect(execute).toHaveBeenCalledWith("DELETE FROM cors", [date], null);
			expect(count).toBe(3);
		});

		it("should return 0 when no rows are deleted", async () => {
			deleteArchive.mockReturnValue("DELETE FROM cors");
			execute.mockResolvedValue({ rowCount: 0 });

			expect(await corsSvc.deleteArchived(new Date())).toBe(0);
		});
	});
});
