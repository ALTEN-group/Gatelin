/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sessionEntPath = path.join(__dirname, "../../../src/entities/session.js");

jest.unstable_mockModule("@dwtechs/sparray", () => ({
	deleteProps: jest.fn(),
}));
jest.unstable_mockModule(sessionEntPath, () => ({
	__esModule: true,
	default: { privateProps: ["password", "internalNote"] },
}));

describe("sendSession middleware", () => {
	let sendSession;
	let deleteProps;
	let sEnt;
	let res;

	beforeAll(async () => {
		const sparrayModule = await import("@dwtechs/sparray");
		deleteProps = sparrayModule.deleteProps;
		const sessionModule = await import("../../../src/entities/session.js");
		sEnt = sessionModule.default;
		const module = await import("../../../src/middlewares/res/send-session.js");
		sendSession = module.sendSession;
	});

	beforeEach(() => {
		deleteProps.mockReset();
		res = {
			locals: { rows: [{ id: 1, nickname: "alice" }] },
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
	});

	it("should strip private props via sEnt.privateProps and send status 200", () => {
		deleteProps.mockReturnValue([{ id: 1, nickname: "alice" }]);

		sendSession({}, res, jest.fn());

		expect(deleteProps).toHaveBeenCalledWith(
			res.locals.rows,
			sEnt.privateProps,
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			id: 1,
			nickname: "alice",
			permissions: [],
		});
	});

	it("should include res.locals.permissions when present", () => {
		res.locals.permissions = [{ route: 1, operations: ["SELECT"] }];
		deleteProps.mockReturnValue([{ id: 1, nickname: "alice" }]);

		sendSession({}, res, jest.fn());

		expect(res.json).toHaveBeenCalledWith({
			id: 1,
			nickname: "alice",
			permissions: [{ route: 1, operations: ["SELECT"] }],
		});
	});

	it("should default permissions to an empty array when not set", () => {
		deleteProps.mockReturnValue([{ id: 2 }]);

		sendSession({}, res, jest.fn());

		expect(res.json).toHaveBeenCalledWith({ id: 2, permissions: [] });
	});
});
