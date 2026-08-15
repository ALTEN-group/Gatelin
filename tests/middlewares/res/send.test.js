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

    // Without this the field ACL only applied to writes, so a restricted role
    // could read every column back from the search endpoints.
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
