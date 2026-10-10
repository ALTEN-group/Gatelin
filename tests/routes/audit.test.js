// @ts-check
/**
 * Audit routes: wiring, read-only surface, and that secrets in raw
 * snapshots never reach the HTTP response.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import request from "supertest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const get = jest.fn((_req, res, next) => {
  res.locals.rows = [
    {
      id: 10,
      tstamp: "2026-10-09T09:00:00.000Z",
      tableName: "role",
      operation: "UPDATE",
      action: "UPDATE",
      userId: 3,
      userName: "admin",
      recordId: 7,
      changedKeys: ["secretKey", "color"],
      previous: { secretKey: "old-secret", color: "#000000" },
      record: { secretKey: "new-secret", color: "#FFFFFF" },
    },
  ];
  res.locals.total = 1;
  next();
});

jest.unstable_mockModule(
  path.join(__dirname, "../../src/entities/audit.js"),
  () => ({
    default: {
      get,
      privateProps: ["changedKeys", "record", "previous"],
      properties: [
        {
          key: "id",
          type: "integer",
          operations: ["SELECT"],
          isFilterable: true,
          isPrivate: false,
        },
      ],
    },
  }),
);

const express = (await import("express")).default;
const { errorHandler } = await import("@dwtechs/errandler-express");
const { send } = await import("../../src/middlewares/res/send.js");
const audit = (await import("../../src/routes/audit.js")).default;
const aEnt = (await import("../../src/entities/audit.js")).default;

const app = express();
app.use(express.json());
app.use("/gatelin/audit", audit, send(aEnt));
errorHandler(app);

describe("audit routes", () => {
  it("POST /search returns redacted changes without raw snapshots", async () => {
    const res = await request(app)
      .post("/gatelin/audit/search")
      .send({ first: 0, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    const [row] = res.body.rows;
    expect(row.changes).toBe("secretKey: [redacted]\ncolor: #000000 → #FFFFFF");
    expect(row).not.toHaveProperty("record");
    expect(row).not.toHaveProperty("previous");
    expect(row).not.toHaveProperty("changedKeys");
    expect(JSON.stringify(res.body)).not.toMatch(/-secret/);
  });

  it("exposes POST /search only (read-only: no history, add, update, archive or schema)", () => {
    const routes = audit.stack
      .filter((layer) => layer.route)
      .map((layer) => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));

    expect(routes).toEqual([{ path: "/search", methods: ["post"] }]);
  });
});
