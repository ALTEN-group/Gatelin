/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import pEnt from "../../src/entities/preference.js";

// normalizeArray stringifies "conf" before validateArray runs, so the
// property type must validate the resulting JSON string, not an object.
const run = (method, row) => {
  const req = { method, body: { rows: [row] } };
  const res = { locals: {} };
  const next = jest.fn();
  pEnt.normalizeArray(req, res, next);
  pEnt.validateArray(req, res, next);
  return next;
};

const conf = [
  { key: "id", isVisible: false },
  { key: "userId", isVisible: true, defaultWidth: "80px" },
];

describe("preference entity", () => {
  it("accepts an array conf on PUT (column resize)", () => {
    const next = run("PUT", { id: 1, name: "Default", isActive: true, conf });

    expect(next).toHaveBeenLastCalledWith();
  });

  it("accepts a PUT without conf (view selection)", () => {
    const next = run("PUT", { id: 1, name: "Default", isActive: true });

    expect(next).toHaveBeenLastCalledWith();
  });

  it("accepts an array conf on POST (view creation)", () => {
    const next = run("POST", {
      userId: 3,
      resourceId: 1,
      name: "Mine",
      isActive: true,
      conf,
    });

    expect(next).toHaveBeenLastCalledWith();
  });
});
