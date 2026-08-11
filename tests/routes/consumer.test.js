/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
// consumer.js has its own inline `send`/`send204` (not the outer app.js `send`).
import { jest } from "@jest/globals";
import supertest from "supertest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../../src/services/consumer.js");
const consumerEntityPath = path.join(
	__dirname,
	"../../src/entities/consumer.js",
);
const cacheConsumerPath = path.join(
	__dirname,
	"../../src/middlewares/cache/consumer.js",
);

jest.unstable_mockModule("@dwtechs/winstan", () => ({
	log: {
		debug: jest.fn(),
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
	},
}));

const parseBearer = jest.fn((req, res, next) => {
	const header = req.headers.authorization;
	if (!header?.startsWith("Bearer "))
		return next({ statusCode: 401, message: "Unauthorized" });
	res.locals.tokens = { access: header.slice(7) };
	next();
});
const decodeAccess = jest.fn((_req, _res, next) => next());
const decodeRefresh = jest.fn((_req, _res, next) => next());
jest.unstable_mockModule("@dwtechs/toker-express", () => ({
	parseBearer,
	decodeAccess,
	decodeRefresh,
	createTokens: jest.fn(),
	refreshTokens: jest.fn(),
	clearRefreshCookie: jest.fn(),
}));

jest.unstable_mockModule(routeSvcPath, () => ({
	__esModule: true,
	default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));
jest.unstable_mockModule(consumerSvcPath, () => ({
	__esModule: true,
	default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));

const get = jest.fn((_req, res, next) => {
	res.locals.rows = [{ id: 1, nickname: "jdoe" }];
	res.locals.total = 1;
	next();
});
const archive = jest.fn((req, res, next) => {
	req.body.rows = [{ id: 1 }];
	next();
});
jest.unstable_mockModule(consumerEntityPath, () => ({
	__esModule: true,
	default: {
		get,
		archive,
		properties: [
			{
				key: "id",
				type: "integer",
				min: null,
				max: null,
				operations: ["SELECT"],
				requiredFor: [],
				isFilterable: true,
				isPrivate: false,
			},
			{
				key: "userId",
				type: "integer",
				min: null,
				max: null,
				operations: ["SELECT"],
				requiredFor: [],
				isFilterable: true,
				isPrivate: false,
			},
			{
				key: "nickname",
				type: "string",
				min: 3,
				max: 30,
				operations: ["SELECT"],
				requiredFor: [],
				isFilterable: true,
				isPrivate: false,
			},
			{
				key: "accessToken",
				type: "jwt",
				min: 28,
				max: 8000,
				operations: ["SELECT"],
				requiredFor: [],
				isFilterable: true,
				isPrivate: true,
			},
			{
				key: "refreshToken",
				type: "jwt",
				min: 28,
				max: 8000,
				operations: ["SELECT"],
				requiredFor: [],
				isFilterable: true,
				isPrivate: true,
			},
			{
				key: "roles",
				type: "array",
				min: null,
				max: null,
				operations: ["SELECT"],
				requiredFor: [],
				isFilterable: true,
				isPrivate: false,
			},
			{
				key: "archived",
				type: "boolean",
				min: null,
				max: null,
				operations: ["SELECT"],
				requiredFor: [],
				isFilterable: true,
				isPrivate: false,
			},
			{
				key: "creatorName",
				type: "string",
				min: 1,
				max: 100,
				operations: ["SELECT"],
				requiredFor: [],
				isFilterable: false,
				isPrivate: false,
			},
			{
				key: "updaterName",
				type: "string",
				min: 1,
				max: 100,
				operations: ["SELECT"],
				requiredFor: [],
				isFilterable: false,
				isPrivate: false,
			},
		],
	},
}));

const deleteFromCache = jest.fn((_req, _res, next) => next());
jest.unstable_mockModule(cacheConsumerPath, () => ({
	addToCache: jest.fn(),
	updateCache: jest.fn(),
	deleteFromCache,
}));

describe("POST /gateway/consumers/search", () => {
	let app;
	let routeSvc;
	let consumerSvc;
	const authedRoute = {
		id: 1,
		url: "/gateway/consumers/search",
		protected: false,
	};

	beforeAll(async () => {
		({ default: routeSvc } = await import("../../src/services/route.js"));
		({ default: consumerSvc } = await import("../../src/services/consumer.js"));
		({ default: app } = await import("../../src/app.js"));
	});

	beforeEach(() => {
		routeSvc.getOne.mockReset().mockReturnValue(authedRoute);
		consumerSvc.getOne.mockReset();
	});

	it("rejects an unauthenticated request", async () => {
		const res = await supertest(app).post("/gateway/consumers/search").send({});

		expect(res.status).toBe(401);
		expect(get).not.toHaveBeenCalled();
	});

	it("returns rows from the consumer entity once authenticated", async () => {
		consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

		const res = await supertest(app)
			.post("/gateway/consumers/search")
			.set("Authorization", "Bearer valid-token")
			.send({});

		expect(res.status).toBe(200);
		expect(res.body).toEqual({ rows: [{ id: 1, nickname: "jdoe" }], total: 1 });
	});
});

describe("POST /gateway/consumers/archive", () => {
	let app;
	let routeSvc;
	let consumerSvc;
	const authedRoute = {
		id: 2,
		url: "/gateway/consumers/archive",
		protected: false,
	};

	beforeAll(async () => {
		({ default: routeSvc } = await import("../../src/services/route.js"));
		({ default: consumerSvc } = await import("../../src/services/consumer.js"));
		({ default: app } = await import("../../src/app.js"));
	});

	beforeEach(() => {
		routeSvc.getOne.mockReset().mockReturnValue(authedRoute);
		consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
	});

	it("archives, syncs the cache, then returns 204", async () => {
		const res = await supertest(app)
			.post("/gateway/consumers/archive")
			.set("Authorization", "Bearer valid-token")
			.send({ rows: [{ id: 1 }] });

		expect(res.status).toBe(204);
		expect(archive).toHaveBeenCalledTimes(1);
		expect(deleteFromCache).toHaveBeenCalledTimes(1);
	});
});

describe("GET /gateway/consumers/schema", () => {
	let app;
	let routeSvc;
	let consumerSvc;
	const authedRoute = {
		id: 3,
		url: "/gateway/consumers/schema",
		protected: false,
	};

	beforeAll(async () => {
		({ default: routeSvc } = await import("../../src/services/route.js"));
		({ default: consumerSvc } = await import("../../src/services/consumer.js"));
		({ default: app } = await import("../../src/app.js"));
	});

	beforeEach(() => {
		routeSvc.getOne.mockReset().mockReturnValue(authedRoute);
		consumerSvc.getOne.mockReset();
	});

	it("rejects an unauthenticated request", async () => {
		const res = await supertest(app).get("/gateway/consumers/schema");

		expect(res.status).toBe(401);
	});

	it("returns only the non-private fields", async () => {
		consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

		const res = await supertest(app)
			.get("/gateway/consumers/schema")
			.set("Authorization", "Bearer valid-token");

		expect(res.status).toBe(200);
		expect(res.body.total).toBe(7);
		expect(res.body.rows.map((r) => r.key)).toEqual([
			"id",
			"userId",
			"nickname",
			"roles",
			"archived",
			"creatorName",
			"updaterName",
		]);
	});
});
