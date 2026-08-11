/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { ignoreExpiration } from "../../../src/middlewares/mappers/ignore-expiration.js";

describe("ignoreExpiration middleware", () => {
	let req, res, next;

	beforeEach(() => {
		req = {};
		next = jest.fn();
	});

	it("should set ignoreExpiration: true on res.locals.tokens when no tokens exist yet", () => {
		res = { locals: {} };

		ignoreExpiration(req, res, next);

		expect(res.locals.tokens).toEqual({ ignoreExpiration: true });
		expect(next).toHaveBeenCalledWith();
	});

	it("should merge ignoreExpiration: true into existing res.locals.tokens", () => {
		res = { locals: { tokens: { access: "a", refresh: "r" } } };

		ignoreExpiration(req, res, next);

		expect(res.locals.tokens).toEqual({
			access: "a",
			refresh: "r",
			ignoreExpiration: true,
		});
		expect(next).toHaveBeenCalledWith();
	});
});
