/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corsSvcPath = path.join(__dirname, "../../../src/services/cors.js");

jest.unstable_mockModule(corsSvcPath, () => ({
  __esModule: true,
  default: {
    addToCache: jest.fn(),
    updateCache: jest.fn(),
    deleteFromCache: jest.fn(),
  },
}));

describe("cors cache middleware", () => {
  let addToCache, updateCache, deleteFromCache;
  let corsSvc;
  let req, res, next;

  beforeAll(async () => {
    const svcModule = await import("../../../src/services/cors.js");
    corsSvc = svcModule.default;
    const module = await import("../../../src/middlewares/cache/cors.js");
    addToCache = module.addToCache;
    updateCache = module.updateCache;
    deleteFromCache = module.deleteFromCache;
  });

  beforeEach(() => {
    res = {};
    next = jest.fn();
  });

  describe("addToCache", () => {
    it("should call corsSvc.addToCache for each row and call next()", () => {
      req = {
        body: {
          rows: [
            { id: 1, name: "a" },
            { id: 2, name: "b" },
          ],
        },
      };

      addToCache(req, res, next);

      expect(corsSvc.addToCache).toHaveBeenCalledTimes(2);
      expect(corsSvc.addToCache).toHaveBeenNthCalledWith(1, {
        id: 1,
        name: "a",
      });
      expect(corsSvc.addToCache).toHaveBeenNthCalledWith(2, {
        id: 2,
        name: "b",
      });
      expect(next).toHaveBeenCalledWith();
    });

    it("should skip when req.body.rows is not an array and still call next()", () => {
      req = { body: {} };

      addToCache(req, res, next);

      expect(corsSvc.addToCache).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("updateCache", () => {
    it("should call corsSvc.updateCache with id and name for each row", () => {
      req = { body: { rows: [{ id: 1, name: "updated" }] } };

      updateCache(req, res, next);

      expect(corsSvc.updateCache).toHaveBeenCalledWith(1, "updated");
      expect(next).toHaveBeenCalledWith();
    });

    it("should skip when req.body.rows is not an array and still call next()", () => {
      req = { body: {} };

      updateCache(req, res, next);

      expect(corsSvc.updateCache).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("deleteFromCache", () => {
    it("should call corsSvc.deleteFromCache with id for each row", () => {
      req = { body: { rows: [{ id: 5 }, { id: 6 }] } };

      deleteFromCache(req, res, next);

      expect(corsSvc.deleteFromCache).toHaveBeenNthCalledWith(1, 5);
      expect(corsSvc.deleteFromCache).toHaveBeenNthCalledWith(2, 6);
      expect(next).toHaveBeenCalledWith();
    });

    it("should skip when req.body.rows is not an array and still call next()", () => {
      req = { body: {} };

      deleteFromCache(req, res, next);

      expect(corsSvc.deleteFromCache).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });
  });
});
