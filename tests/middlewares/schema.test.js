/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import schema from "../../src/middlewares/schema.js";

describe("schema.get middleware", () => {
	let req, res, next;

	beforeEach(() => {
		req = {};
		res = { locals: {} };
		next = jest.fn();
	});

	it("should filter out private properties and map to the public projection shape", () => {
		const entity = {
			properties: [
				{
					key: "id",
					type: "integer",
					min: null,
					max: null,
					operations: ["SELECT"],
					requiredFor: [],
					isFilterable: true,
					isPrivate: true,
					extraInternalField: "should not leak",
				},
				{
					key: "name",
					type: "string",
					min: 1,
					max: 30,
					operations: ["INSERT", "UPDATE"],
					requiredFor: ["POST"],
					isFilterable: true,
					isPrivate: false,
				},
			],
		};

		schema.get(entity)(req, res, next);

		expect(res.locals.rows).toEqual([
			{
				key: "name",
				type: "string",
				min: 1,
				max: 30,
				operations: ["INSERT", "UPDATE"],
				requiredFor: ["POST"],
				isFilterable: true,
			},
		]);
		expect(res.locals.total).toBe(1);
		expect(next).toHaveBeenCalledWith();
	});

	it("should return an empty rows array and total 0 when entity has no properties", () => {
		schema.get({ properties: [] })(req, res, next);

		expect(res.locals.rows).toEqual([]);
		expect(res.locals.total).toBe(0);
		expect(next).toHaveBeenCalledWith();
	});
});
