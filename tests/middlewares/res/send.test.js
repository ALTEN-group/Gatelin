/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { send } from "../../../src/middlewares/res/send.js";

describe("send middleware", () => {
	it("should send rows and total from res.locals as JSON with status 200", () => {
		const res = {
			locals: { rows: [{ id: 1 }, { id: 2 }], total: 2 },
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		send({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			rows: [{ id: 1 }, { id: 2 }],
			total: 2,
		});
	});
});
