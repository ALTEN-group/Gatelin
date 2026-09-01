/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

describe("operation service", () => {
  let operationSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/operation.js");
    operationSvc = module.default;
  });

  beforeEach(() => executeJob.mockReset());

  it("should hard-delete archived operations via the job pool", async () => {
    executeJob.mockResolvedValue({ rows: [{ count: 2 }] });
    const date = new Date("2026-01-01");

    const count = await operationSvc.deleteArchived(date);

    expect(executeJob).toHaveBeenCalledWith(
      "SELECT delete($1, $2, $3) AS count",
      ["public", "operation", date],
    );
    expect(count).toBe(2);
  });
});
