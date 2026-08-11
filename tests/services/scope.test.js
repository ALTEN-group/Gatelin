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

const select = jest.fn();
const deleteArchive = jest.fn();
jest.unstable_mockModule(scopeEntPath, () => ({
	__esModule: true,
	default: { query: { select, deleteArchive } },
}));

describe("scope service", () => {
	let scopeSvc;

	beforeAll(async () => {
		const module = await import("../../src/services/scope.js");
		scopeSvc = module.default;
	});

	beforeEach(() => {
		execute.mockReset();
		select.mockReset();
		deleteArchive.mockReset();
	});

	async function initWithRows(rows) {
		select.mockReturnValue({ query: "SELECT", args: [] });
		execute.mockResolvedValue({ rows });
		await scopeSvc.init();
	}

	describe("init", () => {
		it("should query only non-archived scopes", async () => {
			await initWithRows([{ id: 1, name: "own" }]);

			expect(select).toHaveBeenCalledWith(0, 0, "id", "ASC", {
				archived: { value: false, matchMode: "IS" },
			});
			expect(execute).toHaveBeenCalledWith("SELECT", [], null);
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
		it("should delete scopes archived before the given date and return the row count", async () => {
			deleteArchive.mockReturnValue("DELETE FROM scopes");
			execute.mockResolvedValue({ rowCount: 2 });
			const date = new Date("2026-01-01");

			const count = await scopeSvc.deleteArchived(date);

			expect(execute).toHaveBeenCalledWith("DELETE FROM scopes", [date], null);
			expect(count).toBe(2);
		});

		it("should return 0 when no rows are deleted", async () => {
			deleteArchive.mockReturnValue("DELETE FROM scopes");
			execute.mockResolvedValue({ rowCount: 0 });

			expect(await scopeSvc.deleteArchived(new Date())).toBe(0);
		});
	});
});
