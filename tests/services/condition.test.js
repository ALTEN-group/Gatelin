/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

describe("condition service", () => {
  let conditionSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/condition.js");
    conditionSvc = module.default;
  });

  beforeEach(() => executeJob.mockReset());

  it("should hard-delete archived conditions via the job pool", async () => {
    executeJob.mockResolvedValue({ rows: [{ count: 3 }] });
    const date = new Date("2026-01-01");

    const count = await conditionSvc.deleteArchived(date);

    expect(executeJob).toHaveBeenCalledWith(
      "SELECT delete($1, $2, $3) AS count",
      ["public", "condition", date],
    );
    expect(count).toBe(3);
  });
});
