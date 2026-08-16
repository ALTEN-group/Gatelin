/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const conditionEntPath = path.join(
  __dirname,
  "../../src/entities/condition.js",
);

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const deleteArchive = jest.fn();
jest.unstable_mockModule(conditionEntPath, () => ({
  __esModule: true,
  default: { query: { deleteArchive } },
}));

describe("condition service", () => {
  let conditionSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/condition.js");
    conditionSvc = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    deleteArchive.mockReset();
  });

  it("should delete conditions archived before the given date and return the row count", async () => {
    deleteArchive.mockReturnValue("DELETE FROM conditions");
    execute.mockResolvedValue({ rowCount: 6 });
    const date = new Date("2026-01-01");

    const count = await conditionSvc.deleteArchived(date);

    expect(execute).toHaveBeenCalledWith(
      "DELETE FROM conditions",
      [date],
      null,
    );
    expect(count).toBe(6);
  });

  it("should return 0 when no rows are deleted", async () => {
    deleteArchive.mockReturnValue("DELETE FROM conditions");
    execute.mockResolvedValue({ rowCount: 0 });

    expect(await conditionSvc.deleteArchived(new Date())).toBe(0);
  });
});
