/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { send204 } from "../../../src/middlewares/res/send-204.js";

describe("send204 middleware", () => {
  it("should send a 204 No Content response", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    send204({}, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalled();
  });
});
