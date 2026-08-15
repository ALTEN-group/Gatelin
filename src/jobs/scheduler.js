// @ts-check
import { log } from "@dwtechs/winstan";

const DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Computes the delay until the next occurrence of a UTC hour.
 *
 * @param {number} utcHour - UTC hour (0-23)
 * @param {Date} [from] - Reference point, defaults to now
 * @return {number} Milliseconds to wait
 */
export function msUntilUtcHour(utcHour, from = new Date()) {
  const next = new Date(
    Date.UTC(
      from.getUTCFullYear(),
      from.getUTCMonth(),
      from.getUTCDate(),
      utcHour,
      0,
      0,
      0,
    ),
  );
  if (next <= from) next.setUTCDate(next.getUTCDate() + 1);
  return next.getTime() - from.getTime();
}

/**
 * Schedules a callback to run daily at a fixed UTC hour.
 * Fires at the next occurrence of the target hour, then every 24 h thereafter.
 *
 * Runs are serialized: a run that overruns its 24 h window skips the next tick
 * rather than executing concurrently with itself, which would double the delete
 * load and risk deadlocks on the same rows.
 *
 * @param {number} utcHour - UTC hour (0-23) to run the callback
 * @param {Function} fn - The function to call; awaited if it returns a promise
 * @param {string} [label] - Name used when logging a skipped run
 */
export function scheduleDailyAt(utcHour, fn, label = "job") {
  let running = false;

  const run = async () => {
    if (running) {
      log.warn(`Skipping ${label}: previous run is still in progress`);
      return;
    }
    running = true;
    try {
      await fn();
    } catch (err) {
      log.error(`${label} failed: ${err.message}`);
    } finally {
      running = false;
    }
  };

  setTimeout(() => {
    run();
    setInterval(run, DAY_MS);
  }, msUntilUtcHour(utcHour));
}
