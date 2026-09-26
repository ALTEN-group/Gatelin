/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { send } from "../../../src/middlewares/res/send.js";

describe("send middleware", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      locals: {},
    };
  });

  describe("legacy parameterless / direct invocation", () => {
    it("should send rows and total unchanged when the role has no field restriction", () => {
      res.locals.rows = [{ id: 1, name: "a", secret: "x" }];
      res.locals.total = 1;

      send({}, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        rows: [{ id: 1, name: "a", secret: "x" }],
        total: 1,
      });
    });

    it("should project rows down to the allowed fields, always keeping id", () => {
      res.locals.rows = [
        { id: 1, name: "a", secret: "x" },
        { id: 2, name: "b", secret: "y" },
      ];
      res.locals.total = 2;
      res.locals.aclFields = new Set(["name"]);

      send({}, res);

      expect(res.json).toHaveBeenCalledWith({
        rows: [
          { id: 1, name: "a" },
          { id: 2, name: "b" },
        ],
        total: 2,
      });
    });

    it("should leave a non-array rows value alone", () => {
      res.locals.rows = undefined;
      res.locals.total = 0;
      res.locals.aclFields = new Set(["name"]);

      send({}, res);

      expect(res.json).toHaveBeenCalledWith({ rows: undefined, total: 0 });
    });
  });

  describe("send(ent) factory", () => {
    const mockEnt = {
      privateProps: ["secretKey", "tokenHash"],
    };

    it("should strip entity private props from regular rows", () => {
      res.locals.rows = [
        { id: 1, name: "service-a", secretKey: "abc", tokenHash: "xyz", status: "ok" },
      ];
      res.locals.total = 1;

      send(mockEnt)({}, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        rows: [{ id: 1, name: "service-a", status: "ok" }],
        total: 1,
      });
    });

    it("should strip private props from the nested history record snapshot", () => {
      res.locals.rows = [
        {
          id: 10,
          operation: "UPDATE",
          consumerId: 2,
          consumerName: "admin",
          tstamp: "2026-09-26T20:00:00.000Z",
          record: {
            id: 1,
            name: "service-a",
            secretKey: "abc",
            tokenHash: "xyz",
            status: "ok",
          },
        },
      ];
      res.locals.total = 1;

      send(mockEnt)({}, res);

      expect(res.json).toHaveBeenCalledWith({
        rows: [
          {
            id: 10,
            operation: "UPDATE",
            consumerId: 2,
            consumerName: "admin",
            tstamp: "2026-09-26T20:00:00.000Z",
            record: {
              id: 1,
              name: "service-a",
              status: "ok",
            },
          },
        ],
        total: 1,
      });
    });

    it("should derive private props from properties array when privateProps is not set", () => {
      const entWithProperties = {
        properties: [
          { key: "id", isPrivate: false },
          { key: "name", isPrivate: false },
          { key: "secretKey", isPrivate: true },
        ],
      };
      res.locals.rows = [{ id: 1, name: "item", secretKey: "hidden" }];
      res.locals.total = 1;

      send(entWithProperties)({}, res);

      expect(res.json).toHaveBeenCalledWith({
        rows: [{ id: 1, name: "item" }],
        total: 1,
      });
    });

    it("should merge private props when an array of entities is passed", () => {
      const ent1 = { privateProps: ["secret1"] };
      const ent2 = { privateProps: ["secret2"] };
      res.locals.rows = [{ id: 1, secret1: "a", secret2: "b", name: "c" }];
      res.locals.total = 1;

      send([ent1, ent2])({}, res);

      expect(res.json).toHaveBeenCalledWith({
        rows: [{ id: 1, name: "c" }],
        total: 1,
      });
    });

    it("should strip private props and project ACL fields on regular rows", () => {
      res.locals.rows = [
        { id: 1, name: "service-a", secretKey: "abc", description: "desc" },
      ];
      res.locals.total = 1;
      res.locals.aclFields = new Set(["name", "secretKey"]);

      send(mockEnt)({}, res);

      expect(res.json).toHaveBeenCalledWith({
        rows: [{ id: 1, name: "service-a" }],
        total: 1,
      });
    });

    it("should project nested history records and leave the envelope intact", () => {
      res.locals.rows = [
        {
          id: 5,
          operation: "UPDATE",
          consumerName: "alice",
          record: { id: 1, name: "Default", secretKey: "abc", description: "desc" },
        },
      ];
      res.locals.total = 1;
      res.locals.aclFields = new Set(["name"]);

      send(mockEnt)({}, res);

      expect(res.json).toHaveBeenCalledWith({
        rows: [
          {
            id: 5,
            operation: "UPDATE",
            consumerName: "alice",
            record: { id: 1, name: "Default" },
          },
        ],
        total: 1,
      });
    });

    it("should drop schema descriptors whose key is not allowed", () => {
      res.locals.rows = [
        { key: "id", type: "integer", operations: ["SELECT"] },
        { key: "name", type: "string", operations: ["SELECT"] },
        { key: "extra", type: "string", operations: ["SELECT"] },
      ];
      res.locals.total = 3;
      res.locals.aclFields = new Set(["name"]);

      send(mockEnt)({}, res);

      expect(res.json).toHaveBeenCalledWith({
        rows: [
          { key: "id", type: "integer", operations: ["SELECT"] },
          { key: "name", type: "string", operations: ["SELECT"] },
        ],
        total: 2,
      });
    });

    it("should read from res.locals.history when res.locals.rows is not present", () => {
      res.locals.history = [
        {
          id: 1,
          operation: "UPDATE",
          record: { id: 1, name: "a", secretKey: "x" },
        },
      ];
      res.locals.total = 1;

      send(mockEnt)({}, res);

      expect(res.json).toHaveBeenCalledWith({
        rows: [
          {
            id: 1,
            operation: "UPDATE",
            record: { id: 1, name: "a" },
          },
        ],
        total: 1,
      });
    });
  });
});
