/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { createRow } from "../../../../src/middlewares/mappers/consumer/createRow.js";

describe("createRow middleware", () => {
  let req, res, next;

  beforeEach(() => {
    res = { locals: { consumer: { id: 42 } } };
    next = jest.fn();
  });

  it("should create req.body when missing and set rows to the consumer id", () => {
    req = {};

    createRow(req, res, next);

    expect(req.body).toEqual({ rows: [{ id: 42 }] });
    expect(next).toHaveBeenCalledWith();
  });

  it("should set rows on an existing req.body without dropping other properties", () => {
    req = { body: { someField: "keep-me" } };

    createRow(req, res, next);

    expect(req.body).toEqual({ someField: "keep-me", rows: [{ id: 42 }] });
    expect(next).toHaveBeenCalledWith();
  });
});
