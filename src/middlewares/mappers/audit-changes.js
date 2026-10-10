// @ts-check
import { isNil, isString } from "@dwtechs/checkard";

const REDACTED = "[redacted]";
const MAX_VALUE_LENGTH = 80;
const SECRET_KEY = /hash|secret/i;
// Stamped on every created/deleted row; not part of what the user changed.
const BOOKKEEPING_KEYS = new Set(["createdAt", "creatorId", "creatorName"]);

/** @param {unknown} value */
function format(value) {
  if (isNil(value)) return "null";
  const s = isString(value) ? value : JSON.stringify(value);
  return s.length > MAX_VALUE_LENGTH ? `${s.slice(0, MAX_VALUE_LENGTH)}…` : s;
}

/**
 * @param {string} key
 * @param {Record<string, unknown>} record
 * @param {Record<string, unknown>|null} previous
 * @param {string} operation
 */
function line(key, record, previous, operation) {
  if (SECRET_KEY.test(key)) return `${key}: ${REDACTED}`;
  if (operation !== "UPDATE") return `${key}: ${format(record[key])}`;
  return `${key}: ${format(previous?.[key])} → ${format(record[key])}`;
}

/**
 * Turns each log.audit row's raw snapshots into a human-readable `changes`
 * text. Secret values are never written to it; the snapshots themselves are
 * dropped so they cannot reach the response even if `send` is bypassed.
 *
 * @type {import("express").RequestHandler}
 */
export function buildChanges(_req, res, next) {
  res.locals.rows = res.locals.rows.map(
    ({ record, previous, changedKeys, ...row }) => {
      const keys = (changedKeys ?? []).filter(
        (k) =>
          // Created/deleted rows list every column; null ones, the id and bookkeeping add nothing.
          row.operation === "UPDATE" ||
          (k !== "id" && !BOOKKEEPING_KEYS.has(k) && !isNil(record?.[k])),
      );
      return {
        ...row,
        changes: keys
          .map((k) => line(k, record ?? {}, previous ?? null, row.operation))
          .join("\n"),
      };
    },
  );
  next();
}
