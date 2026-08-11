/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

describe("csrf-cookie middleware (custom REFRESH_TOKEN_COOKIE_SAMESITE)", () => {
	let setCsrfCookie;
	let res;
	let next;

	beforeAll(async () => {
		// Set before the module is loaded: sameSite is computed once at module-load time.
		process.env.REFRESH_TOKEN_COOKIE_SAMESITE = "Lax";
		const module = await import("../../../src/middlewares/res/csrf-cookie.js");
		setCsrfCookie = module.setCsrfCookie;
	});

	afterAll(() => {
		delete process.env.REFRESH_TOKEN_COOKIE_SAMESITE;
	});

	beforeEach(() => {
		res = { cookie: jest.fn() };
		next = jest.fn();
	});

	it("should use the configured sameSite value (case-insensitively) when it is a valid option", () => {
		setCsrfCookie({}, res, next);

		const [, , options] = res.cookie.mock.calls[0];
		expect(options.sameSite).toBe("lax");
		expect(next).toHaveBeenCalledWith();
	});
});
