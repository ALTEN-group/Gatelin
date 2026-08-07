/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schedulerPath = path.join(__dirname, "../../src/jobs/scheduler.js");

const scheduleDailyAt = jest.fn();
jest.unstable_mockModule(schedulerPath, () => ({ scheduleDailyAt }));

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const log = { info: jest.fn(), error: jest.fn() };
jest.unstable_mockModule("@dwtechs/winstan", () => ({ log }));

describe("startDeleteOldHistoryJob", () => {
  let startDeleteOldHistoryJob;

  beforeAll(async () => {
    const module = await import("../../src/jobs/delete-old-history.js");
    startDeleteOldHistoryJob = module.startDeleteOldHistoryJob;
  });

  beforeEach(() => {
    scheduleDailyAt.mockReset();
    execute.mockReset();
    log.info.mockReset();
    log.error.mockReset();
  });

  it("should register the job to run daily at 3 AM UTC", () => {
    startDeleteOldHistoryJob();

    expect(scheduleDailyAt).toHaveBeenCalledWith(3, expect.any(Function));
    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("initialized"),
    );
  });

  it("should delete history rows older than 6 months and log the count", async () => {
    execute.mockResolvedValue({ rowCount: 42 });
    startDeleteOldHistoryJob();
    const callback = scheduleDailyAt.mock.calls[0][1];

    await callback();

    expect(execute).toHaveBeenCalledWith(
      "DELETE FROM log.history WHERE created < $1",
      [expect.any(Date)],
      null,
    );
    expect(log.info).toHaveBeenCalledWith(expect.stringContaining("42"));
  });

  it("should default to 0 deleted when rowCount is falsy", async () => {
    execute.mockResolvedValue({ rowCount: 0 });
    startDeleteOldHistoryJob();
    const callback = scheduleDailyAt.mock.calls[0][1];

    await callback();

    expect(log.info).toHaveBeenCalledWith(expect.stringContaining("0 old"));
  });

  it("should log an error instead of throwing when the deletion query fails", async () => {
    execute.mockRejectedValue(new Error("db down"));
    startDeleteOldHistoryJob();
    const callback = scheduleDailyAt.mock.calls[0][1];

    await expect(callback()).resolves.toBeUndefined();
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining("db down"));
  });
});
