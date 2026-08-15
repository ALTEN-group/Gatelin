/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const log = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
jest.unstable_mockModule("@dwtechs/winstan", () => ({ log }));

describe("scheduleDailyAt", () => {
  let scheduleDailyAt;

  beforeAll(async () => {
    const module = await import("../../src/jobs/scheduler.js");
    scheduleDailyAt = module.scheduleDailyAt;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should schedule for later today when the target hour hasn't passed yet", () => {
    jest.setSystemTime(new Date(Date.UTC(2026, 0, 1, 10, 0, 0)));
    const fn = jest.fn();

    scheduleDailyAt(14, fn);

    jest.advanceTimersByTime(4 * 60 * 60 * 1000 - 1);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should schedule for tomorrow when the target hour has already passed today", () => {
    jest.setSystemTime(new Date(Date.UTC(2026, 0, 1, 10, 0, 0)));
    const fn = jest.fn();

    scheduleDailyAt(2, fn);

    jest.advanceTimersByTime(16 * 60 * 60 * 1000 - 1);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should schedule for tomorrow when now exactly equals the target hour", () => {
    jest.setSystemTime(new Date(Date.UTC(2026, 0, 1, 2, 0, 0, 0)));
    const fn = jest.fn();

    scheduleDailyAt(2, fn);

    jest.advanceTimersByTime(24 * 60 * 60 * 1000 - 1);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should re-run the callback every 24 hours after the first run", async () => {
    jest.setSystemTime(new Date(Date.UTC(2026, 0, 1, 10, 0, 0)));
    const fn = jest.fn();

    scheduleDailyAt(14, fn);
    // Async variant flushes the microtasks that clear the in-progress flag
    // between ticks; the sync one would leave every later run looking overlapped.
    await jest.advanceTimersByTimeAsync(4 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(24 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(24 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should skip a tick while the previous run is still in progress", async () => {
    jest.setSystemTime(new Date(Date.UTC(2026, 0, 1, 10, 0, 0)));
    let release;
    const fn = jest.fn(
      () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    );

    scheduleDailyAt(14, fn, "slow-job");
    await jest.advanceTimersByTimeAsync(4 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(1);

    // A run that overruns its 24 h window must not start a second copy against
    // the same rows.
    await jest.advanceTimersByTimeAsync(24 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining("slow-job"));

    release();
    await jest.advanceTimersByTimeAsync(24 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should log a failed run and keep the schedule alive", async () => {
    jest.setSystemTime(new Date(Date.UTC(2026, 0, 1, 10, 0, 0)));
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("db down"))
      .mockResolvedValue(undefined);

    scheduleDailyAt(14, fn, "flaky-job");
    await jest.advanceTimersByTimeAsync(4 * 60 * 60 * 1000);

    expect(log.error).toHaveBeenCalledWith(
      expect.stringContaining("flaky-job failed: db down"),
    );

    await jest.advanceTimersByTimeAsync(24 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
