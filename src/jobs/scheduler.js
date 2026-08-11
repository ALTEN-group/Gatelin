// @ts-check

const DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Schedules a callback to run daily at a fixed UTC hour.
 * Fires at the next occurrence of the target hour, then every 24 h thereafter.
 *
 * @param {number} utcHour - UTC hour (0-23) to run the callback
 * @param {Function} fn - The function to call
 */
export function scheduleDailyAt(utcHour, fn) {
  const now = new Date();
  const next = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      utcHour,
      0,
      0,
      0,
    ),
  );
  if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
  setTimeout(() => {
    fn();
    setInterval(fn, DAY_MS);
  }, next - now);
}
