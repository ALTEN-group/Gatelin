/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fieldEntPath = path.join(__dirname, "../../src/entities/field.js");

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const deleteArchive = jest.fn();
jest.unstable_mockModule(fieldEntPath, () => ({
  __esModule: true,
  default: { query: { deleteArchive } },
}));

describe("field service", () => {
  let fieldSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/field.js");
    fieldSvc = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    deleteArchive.mockReset();
  });

  it("should delete fields archived before the given date and return the row count", async () => {
    deleteArchive.mockReturnValue("DELETE FROM fields");
    execute.mockResolvedValue({ rowCount: 6 });
    const date = new Date("2026-01-01");

    const count = await fieldSvc.deleteArchived(date);

    expect(execute).toHaveBeenCalledWith("DELETE FROM fields", [date], null);
    expect(count).toBe(6);
  });

  it("should return 0 when no rows are deleted", async () => {
    deleteArchive.mockReturnValue("DELETE FROM fields");
    execute.mockResolvedValue({ rowCount: 0 });

    expect(await fieldSvc.deleteArchived(new Date())).toBe(0);
  });
});
