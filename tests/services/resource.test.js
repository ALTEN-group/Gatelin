/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resourceEntPath = path.join(__dirname, "../../src/entities/resource.js");

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const deleteArchive = jest.fn();
jest.unstable_mockModule(resourceEntPath, () => ({
  __esModule: true,
  default: { query: { deleteArchive } },
}));

describe("resource service", () => {
  let resourceSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/resource.js");
    resourceSvc = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    deleteArchive.mockReset();
  });

  it("should delete resources archived before the given date and return the row count", async () => {
    deleteArchive.mockReturnValue("DELETE FROM resources");
    execute.mockResolvedValue({ rowCount: 7 });
    const date = new Date("2026-01-01");

    const count = await resourceSvc.deleteArchived(date);

    expect(execute).toHaveBeenCalledWith("DELETE FROM resources", [date], null);
    expect(count).toBe(7);
  });

  it("should return 0 when no rows are deleted", async () => {
    deleteArchive.mockReturnValue("DELETE FROM resources");
    execute.mockResolvedValue({ rowCount: 0 });

    expect(await resourceSvc.deleteArchived(new Date())).toBe(0);
  });
});
