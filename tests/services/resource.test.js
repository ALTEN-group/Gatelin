/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

describe("resource service", () => {
  let resourceSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/resource.js");
    resourceSvc = module.default;
  });

  beforeEach(() => executeJob.mockReset());

  it("should hard-delete archived resources via the job pool", async () => {
    executeJob.mockResolvedValue({ rows: [{ count: 4 }] });
    const date = new Date("2026-01-01");

    const count = await resourceSvc.deleteArchived(date);

    expect(executeJob).toHaveBeenCalledWith(
      "SELECT delete($1, $2, $3) AS count",
      ["public", "resource", date],
    );
    expect(count).toBe(4);
  });
});
