/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

describe("application service", () => {
  let applicationSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/application.js");
    applicationSvc = module.default;
  });

  beforeEach(() => executeJob.mockReset());

  it("should hard-delete archived applications via the job pool", async () => {
    executeJob.mockResolvedValue({ rows: [{ count: 5 }] });
    const date = new Date("2026-01-01");

    const count = await applicationSvc.deleteArchived(date);

    expect(executeJob).toHaveBeenCalledWith(
      "SELECT delete($1, $2, $3) AS count",
      ["public", "application", date],
    );
    expect(count).toBe(5);
  });
});
