/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { attachUserId } from "../../../../src/middlewares/mappers/consumer/attachUserId.js";

describe("attachUserId middleware", () => {
	let req, res, next;

	beforeEach(() => {
		req = { body: { pwd: "s3cr3t" } };
		res = { locals: { user: { id: 42 } } };
		next = jest.fn();
	});

	it("should set req.body.userId from res.locals.user.id, then call next()", () => {
		attachUserId(req, res, next);

		expect(req.body.userId).toBe(42);
		expect(req.body.pwd).toBe("s3cr3t");
		expect(next).toHaveBeenCalledWith();
	});
});
