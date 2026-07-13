// @ts-check

/**
 * Compares two preference `conf` values for meaningful equality.
 *
 * The crud-builder front-end always rebuilds the currently active view's
 * `conf` on save (`setColumnsInView`), keeping only `key`/`isVisible` per
 * column and dropping cosmetic seed-only properties like `defaultWidth`.
 * Comparing raw JSON would then always flag the active (e.g. "Default")
 * view as changed, even when the user touched nothing. Normalize to the
 * `key`/`isVisible` subset (order-sensitive, so reordering still counts as
 * a change) before comparing.
 *
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function confEquals(a, b) {
  /** @param {unknown} conf */
  const normalize = (conf) =>
    Array.isArray(conf)
      ? conf.map((c) => ({ key: c?.key, isVisible: c?.isVisible }))
      : conf;
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}
