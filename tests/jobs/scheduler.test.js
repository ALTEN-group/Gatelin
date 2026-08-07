/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

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

  it("should re-run the callback every 24 hours after the first run", () => {
    jest.setSystemTime(new Date(Date.UTC(2026, 0, 1, 10, 0, 0)));
    const fn = jest.fn();

    scheduleDailyAt(14, fn);
    jest.advanceTimersByTime(4 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(24 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(24 * 60 * 60 * 1000);
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
