/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { filterByEmailNotArchived } from "../../../src/middlewares/filters/byEmailNotArchived.js";

describe("filterByEmailNotArchived middleware", () => {
	let req, res, next;

	beforeEach(() => {
		req = { body: { email: "test@example.com" } };
		res = {};
		next = jest.fn();
	});

	it("should set req.body.filters from req.body.email and call next()", () => {
		filterByEmailNotArchived(req, res, next);

		expect(req.body.filters).toEqual({
			email: { value: "test@example.com", matchMode: "equals" },
			archived: { value: false, matchMode: "IS" },
		});
		expect(next).toHaveBeenCalledWith();
	});

	it("should set filters.email.value to undefined when req.body.email is missing", () => {
		req.body = {};

		filterByEmailNotArchived(req, res, next);

		expect(req.body.filters.email.value).toBeUndefined();
		expect(next).toHaveBeenCalledWith();
	});
});
