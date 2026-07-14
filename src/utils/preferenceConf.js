// @ts-check

/**
 * Compares two preference `conf` values for meaningful equality.
 *
 * The crud-builder front-end rebuilds the currently active view's `conf` on
 * save (`setColumnsInView`), normalizing each column down to its `key`,
 * `isVisible` and `defaultWidth`. Normalize to that same subset (order-
 * sensitive, so reordering still counts as a change) before comparing, so
 * extra/legacy properties on either side don't cause false positives.
 *
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function confEquals(a, b) {
  /** @param {unknown} conf */
  const normalize = (conf) =>
    Array.isArray(conf)
      ? conf.map((c) => ({
          key: c?.key,
          isVisible: c?.isVisible,
          defaultWidth: c?.defaultWidth,
        }))
      : conf;
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}
