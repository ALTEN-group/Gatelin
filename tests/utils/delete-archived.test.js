/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const executeJob = jest.fn();
jest.unstable_mockModule("../../src/jobs/job-pool.js", () => ({ executeJob }));

describe("makeDeleteArchived", () => {
  let makeDeleteArchived;

  beforeAll(async () => {
    ({ makeDeleteArchived } = await import(
      "../../src/utils/delete-archived.js"
    ));
  });

  beforeEach(() => executeJob.mockReset());

  it("calls SQL delete() on the job pool with the physical table name", async () => {
    executeJob.mockResolvedValue({ rows: [{ count: 4 }] });
    const date = new Date("2026-01-01");

    const count = await makeDeleteArchived("route")(date);

    expect(executeJob).toHaveBeenCalledWith(
      "SELECT delete($1, $2, $3) AS count",
      ["public", "route", date],
    );
    expect(count).toBe(4);
  });

  it("returns 0 when the helper deletes nothing", async () => {
    executeJob.mockResolvedValue({ rows: [{ count: 0 }] });
    expect(await makeDeleteArchived("cors")(new Date())).toBe(0);
  });
});
