/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

describe("field service", () => {
  let fieldSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/field.js");
    fieldSvc = module.default;
  });

  beforeEach(() => executeJob.mockReset());

  it("should hard-delete archived fields via the job pool", async () => {
    executeJob.mockResolvedValue({ rows: [{ count: 6 }] });
    const date = new Date("2026-01-01");

    const count = await fieldSvc.deleteArchived(date);

    expect(executeJob).toHaveBeenCalledWith(
      "SELECT delete($1, $2, $3) AS count",
      ["public", "field", date],
    );
    expect(count).toBe(6);
  });
});
