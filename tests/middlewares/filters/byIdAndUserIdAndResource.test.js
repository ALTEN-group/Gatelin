/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { filterByIdAndUserIdAndResource } from "../../../src/middlewares/filters/byIdAndUserIdAndResource.js";

describe("filterByIdAndUserIdAndResource middleware", () => {
	let req, res, next;

	beforeEach(() => {
		req = { params: { resource: "dashboard", id: "7" } };
		res = { locals: { consumer: { userId: 42 } } };
		next = jest.fn();
	});

	it("should create req.body when missing and set filters from params/consumer", () => {
		filterByIdAndUserIdAndResource(req, res, next);

		expect(req.body).toEqual({
			filters: {
				id: { value: "7", matchMode: "=" },
				userId: { value: 42, matchMode: "=" },
				resourceName: { value: "dashboard", matchMode: "=" },
			},
		});
		expect(next).toHaveBeenCalledWith();
	});

	it("should merge with pre-existing req.body.filters without dropping other filters", () => {
		req.body = { filters: { name: { value: "x", matchMode: "=" } } };

		filterByIdAndUserIdAndResource(req, res, next);

		expect(req.body.filters).toEqual({
			name: { value: "x", matchMode: "=" },
			id: { value: "7", matchMode: "=" },
			userId: { value: 42, matchMode: "=" },
			resourceName: { value: "dashboard", matchMode: "=" },
		});
		expect(next).toHaveBeenCalledWith();
	});

	it("should preserve other pre-existing req.body properties", () => {
		req.body = { rows: [{ conf: {} }] };

		filterByIdAndUserIdAndResource(req, res, next);

		expect(req.body.rows).toEqual([{ conf: {} }]);
		expect(next).toHaveBeenCalledWith();
	});
});
