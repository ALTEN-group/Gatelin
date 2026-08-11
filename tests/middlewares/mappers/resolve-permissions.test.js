/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const roleSvcPath = path.join(__dirname, "../../../src/services/role.js");

jest.unstable_mockModule(roleSvcPath, () => ({
	__esModule: true,
	default: { init: jest.fn(), getOne: jest.fn(), deleteArchived: jest.fn() },
}));

describe("resolvePermissions middleware", () => {
	let resolvePermissions;
	let roleSvc;
	let req, res, next;

	beforeAll(async () => {
		const roleModule = await import("../../../src/services/role.js");
		roleSvc = roleModule.default;
		const module = await import(
			"../../../src/middlewares/mappers/resolve-permissions.js"
		);
		resolvePermissions = module.resolvePermissions;
	});

	beforeEach(() => {
		req = {};
		res = { locals: { rows: [{ roles: [] }] } };
		next = jest.fn();
	});

	describe("role not found in cache", () => {
		it("should set empty permissions when role is not found in cache (stale token)", () => {
			res.locals.rows = [{ roles: [99] }];
			roleSvc.getOne.mockReturnValue(undefined);

			resolvePermissions(req, res, next);

			expect(res.locals.permissions).toEqual([]);
			expect(next).toHaveBeenCalledWith();
		});
	});

	// Regression pack for the audit finding:
	//   "Unguarded roles access can throw / return an unhandled 500"
	// Before the `?? []` normalization in resolve-permissions.js, any consumer
	// record whose `roles` column was missing (schema drift, RETURNING clause
	// without roles, upstream payload without the key) or explicitly null
	// (nullable column with no roles assigned) would trip
	// `roles.length === 1` with a TypeError → Express 5 generic 500.
	//
	// Post-fix contract: all three "no roles" shapes normalize to `[]`, skip
	// the fast path, iterate the multi-role loop zero times, and produce an
	// empty permissions array — same fail-closed outcome as the "role not in
	// cache" branch above.
	describe("no-roles source shapes (audit regression)", () => {
		it.each([
			["undefined roles key", [{}]],
			["explicit null roles column", [{ roles: null }]],
			["explicit undefined roles column", [{ roles: undefined }]],
		])(
			"should set empty permissions and call next() for %s",
			(_label, rows) => {
				res.locals.rows = rows;

				expect(() => resolvePermissions(req, res, next)).not.toThrow();

				expect(res.locals.permissions).toEqual([]);
				expect(next).toHaveBeenCalledWith();
				// No role lookup should ever be attempted for a consumer with no
				// roles — proves the fast path is skipped AND the multi-role loop
				// exits without dereferencing anything from the cache.
				expect(roleSvc.getOne).not.toHaveBeenCalled();
			},
		);

		it.each([
			["missing rows array", { locals: {} }],
			["empty rows array", { locals: { rows: [] } }],
		])("should not throw when the whole rows source is %s", (_label, mock) => {
			res = mock;

			expect(() => resolvePermissions(req, res, next)).not.toThrow();

			expect(res.locals.permissions).toEqual([]);
			expect(next).toHaveBeenCalledWith();
			expect(roleSvc.getOne).not.toHaveBeenCalled();
		});
	});

	describe("single role", () => {
		it("should map permissions from a single role", () => {
			res.locals.rows = [{ roles: [1] }];
			roleSvc.getOne.mockReturnValue({
				permissions: new Map([
					[6, { route: 6, operations: [2], fields: null }],
					[11, { route: 11, operations: [2, 3], fields: ["name"] }],
				]),
			});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions).toEqual([
				{ route: 6, operations: [2], fields: null },
				{ route: 11, operations: [2, 3], fields: ["name"] },
			]);
			expect(next).toHaveBeenCalledWith();
		});

		it("should default fields to null when permission has no fields property", () => {
			res.locals.rows = [{ roles: [1] }];
			roleSvc.getOne.mockReturnValue({
				permissions: new Map([[6, { route: 6, operations: [2] }]]),
			});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions).toEqual([
				{ route: 6, operations: [2], fields: null },
			]);
		});
	});

	describe("multiple roles — no overlap", () => {
		it("should merge permissions from distinct routes", () => {
			res.locals.rows = [{ roles: [1, 2] }];
			roleSvc.getOne
				.mockReturnValueOnce({
					permissions: new Map([
						[6, { route: 6, operations: [2], fields: null }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[41, { route: 41, operations: [2, 3], fields: null }],
					]),
				});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions).toEqual([
				{ route: 6, operations: [2], fields: null },
				{ route: 41, operations: [2, 3], fields: null },
			]);
		});
	});

	describe("multiple roles — same route, operations merge", () => {
		it("should union operations when two roles grant the same route", () => {
			res.locals.rows = [{ roles: [1, 2] }];
			roleSvc.getOne
				.mockReturnValueOnce({
					permissions: new Map([
						[6, { route: 6, operations: [2], fields: null }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[6, { route: 6, operations: [5], fields: null }],
					]),
				});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions).toHaveLength(1);
			expect(res.locals.permissions[0]).toEqual({
				route: 6,
				operations: expect.arrayContaining([2, 5]),
				fields: null,
			});
			expect(res.locals.permissions[0].operations).toHaveLength(2);
		});

		it("should deduplicate overlapping operations", () => {
			res.locals.rows = [{ roles: [1, 2] }];
			roleSvc.getOne
				.mockReturnValueOnce({
					permissions: new Map([
						[6, { route: 6, operations: [2, 3], fields: null }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[6, { route: 6, operations: [2, 5], fields: null }],
					]),
				});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions[0].operations).toEqual(
				expect.arrayContaining([2, 3, 5]),
			);
			expect(res.locals.permissions[0].operations).toHaveLength(3);
		});
	});

	describe("multiple roles — same route, fields merge", () => {
		it("should union fields when both roles restrict fields", () => {
			res.locals.rows = [{ roles: [1, 2] }];
			roleSvc.getOne
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [2], fields: ["id", "name"] }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[
							11,
							{ route: 11, operations: [2], fields: ["name", "description"] },
						],
					]),
				});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions[0].fields).toEqual(
				expect.arrayContaining(["id", "name", "description"]),
			);
			expect(res.locals.permissions[0].fields).toHaveLength(3);
		});

		it("should set fields to null when one role is unrestricted (null) and the other restricts", () => {
			res.locals.rows = [{ roles: [1, 2] }];
			roleSvc.getOne
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [2], fields: null }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [2], fields: ["name"] }],
					]),
				});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions[0].fields).toBeNull();
		});

		it("should set fields to null when restricted role comes before unrestricted role", () => {
			res.locals.rows = [{ roles: [1, 2] }];
			roleSvc.getOne
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [2], fields: ["name"] }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [2], fields: null }],
					]),
				});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions[0].fields).toBeNull();
		});
	});

	describe("multiple roles — three or more roles on the same route", () => {
		it("should union operations and fields across three roles contributing the same route", () => {
			res.locals.rows = [{ roles: [1, 2, 3] }];
			roleSvc.getOne
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [2], fields: ["id"] }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [3], fields: ["name"] }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [2, 5], fields: ["description"] }],
					]),
				});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions).toHaveLength(1);
			expect(res.locals.permissions[0].operations).toEqual(
				expect.arrayContaining([2, 3, 5]),
			);
			expect(res.locals.permissions[0].operations).toHaveLength(3);
			expect(res.locals.permissions[0].fields).toEqual(
				expect.arrayContaining(["id", "name", "description"]),
			);
			expect(res.locals.permissions[0].fields).toHaveLength(3);
		});

		it("should keep fields null once set, even if a later role restricts fields", () => {
			res.locals.rows = [{ roles: [1, 2, 3] }];
			roleSvc.getOne
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [2], fields: ["id"] }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [3], fields: null }],
					]),
				})
				.mockReturnValueOnce({
					permissions: new Map([
						[11, { route: 11, operations: [5], fields: ["name"] }],
					]),
				});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions[0].fields).toBeNull();
			expect(res.locals.permissions[0].operations).toEqual(
				expect.arrayContaining([2, 3, 5]),
			);
		});

		it("should skip roles missing from the cache while still merging the others", () => {
			res.locals.rows = [{ roles: [1, 99, 2] }];
			roleSvc.getOne
				.mockReturnValueOnce({
					permissions: new Map([
						[6, { route: 6, operations: [2], fields: null }],
					]),
				})
				.mockReturnValueOnce(undefined) // role 99 not found in cache (stale token)
				.mockReturnValueOnce({
					permissions: new Map([
						[6, { route: 6, operations: [3], fields: null }],
					]),
				});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions).toHaveLength(1);
			expect(res.locals.permissions[0].operations).toEqual(
				expect.arrayContaining([2, 3]),
			);
		});

		it("should return empty permissions when all roles are missing from the cache", () => {
			res.locals.rows = [{ roles: [98, 99] }];
			roleSvc.getOne.mockReturnValue(undefined);

			resolvePermissions(req, res, next);

			expect(res.locals.permissions).toEqual([]);
			expect(next).toHaveBeenCalledWith();
		});
	});

	describe("output does not include internal cache properties", () => {
		it("should not include _fieldsSet in permissions output", () => {
			res.locals.rows = [{ roles: [1] }];
			roleSvc.getOne.mockReturnValue({
				permissions: new Map([
					[
						6,
						{
							route: 6,
							operations: [2],
							fields: ["name"],
							_fieldsSet: new Set(["name"]),
						},
					],
				]),
			});

			resolvePermissions(req, res, next);

			expect(res.locals.permissions[0]._fieldsSet).toBeUndefined();
		});
	});
});
