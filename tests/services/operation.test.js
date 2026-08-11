/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const operationEntPath = path.join(
  __dirname,
  "../../src/entities/operation.js",
);

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const deleteArchive = jest.fn();
jest.unstable_mockModule(operationEntPath, () => ({
  __esModule: true,
  default: { query: { deleteArchive } },
}));

describe("operation service", () => {
  let operationSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/operation.js");
    operationSvc = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    deleteArchive.mockReset();
  });

  it("should delete operations archived before the given date and return the row count", async () => {
    deleteArchive.mockReturnValue("DELETE FROM operations");
    execute.mockResolvedValue({ rowCount: 6 });
    const date = new Date("2026-01-01");

    const count = await operationSvc.deleteArchived(date);

    expect(execute).toHaveBeenCalledWith(
      "DELETE FROM operations",
      [date],
      null,
    );
    expect(count).toBe(6);
  });

  it("should return 0 when no rows are deleted", async () => {
    deleteArchive.mockReturnValue("DELETE FROM operations");
    execute.mockResolvedValue({ rowCount: 0 });

    expect(await operationSvc.deleteArchived(new Date())).toBe(0);
  });
});
