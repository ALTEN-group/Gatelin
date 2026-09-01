/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

describe("service service", () => {
  let serviceSvc;

  beforeAll(async () => {
    const module = await import("../../src/services/service.js");
    serviceSvc = module.default;
  });

  beforeEach(() => executeJob.mockReset());

  it("should hard-delete archived services via the job pool", async () => {
    executeJob.mockResolvedValue({ rows: [{ count: 1 }] });
    const date = new Date("2026-01-01");

    const count = await serviceSvc.deleteArchived(date);

    expect(executeJob).toHaveBeenCalledWith(
      "SELECT delete($1, $2, $3) AS count",
      ["public", "service", date],
    );
    expect(count).toBe(1);
  });
});
