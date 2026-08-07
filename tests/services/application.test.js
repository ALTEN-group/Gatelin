/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const applicationEntPath = path.join(
  __dirname,
  "../../src/entities/application.js",
);

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const deleteArchive = jest.fn();
jest.unstable_mockModule(applicationEntPath, () => ({
  __esModule: true,
  default: { query: { deleteArchive } },
}));

describe("application service", () => {
  let applicationSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/application.js");
    applicationSvc = module.default;
  });

  beforeEach(() => {
    execute.mockReset();
    deleteArchive.mockReset();
  });

  it("should delete applications archived before the given date and return the row count", async () => {
    deleteArchive.mockReturnValue("DELETE FROM applications");
    execute.mockResolvedValue({ rowCount: 5 });
    const date = new Date("2026-01-01");

    const count = await applicationSvc.deleteArchived(date);

    expect(execute).toHaveBeenCalledWith(
      "DELETE FROM applications",
      [date],
      null,
    );
    expect(count).toBe(5);
  });

  it("should return 0 when no rows are deleted", async () => {
    deleteArchive.mockReturnValue("DELETE FROM applications");
    execute.mockResolvedValue({ rowCount: 0 });

    expect(await applicationSvc.deleteArchived(new Date())).toBe(0);
  });
});
