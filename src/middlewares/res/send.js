// @ts-check
import {
  isArray,
  isFunction,
  isObject,
  isSet,
  isString,
} from "@dwtechs/checkard";
import { deleteProps } from "@dwtechs/sparray";
import { filterFields } from "../validators/check-acl.js";

/**
 * Extracts private property keys from an entity or list of entities.
 *
 * @param {any} ent
 * @returns {string[]}
 */
function getPrivateProps(ent) {
  if (isArray(ent)) {
    const props = new Set();
    for (const e of ent) {
      for (const p of getPrivateProps(e)) {
        props.add(p);
      }
    }
    return [...props];
  }
  if (isArray(ent?.privateProps)) return ent.privateProps;
  if (isArray(ent?.properties))
    return ent.properties.filter((p) => p.isPrivate).map((p) => p.key);
  return [];
}

/**
 * Always keeps `id`. History envelopes keep their own keys and only the nested
 * `record` is projected. Schema descriptors (`key` + `operations`) are dropped
 * when the property is not allowed.
 *
 * @param {Array<object>} rows
 * @param {Set<string>|null} allowed
 * @returns {Array<object>}
 */
function projectAcl(rows, allowed) {
  if (!isSet(allowed)) return rows;
  const out = [];
  for (const row of rows) {
    if (!isObject(row)) {
      out.push(row);
      continue;
    }
    if (isObject(row.record) && row.operation) {
      out.push({ ...row, record: filterFields(row.record, allowed) });
      continue;
    }
    if (isString(row.key) && isArray(row.operations)) {
      if (row.key === "id" || allowed.has(row.key)) out.push(row);
      continue;
    }
    out.push(filterFields(row, allowed));
  }
  return out;
}

/**
 * Creates a terminal response middleware that strips private entity properties
 * and projects remaining keys onto the consumer's allowed ACL fields.
 *
 * If called directly with `(req, res)` (e.g. legacy parameterless middleware),
 * it executes immediately without entity scrubbing.
 *
 * @param {any} [ent] - SQLEntity instance, array of entities, or Express req if called directly
 * @param {any} [res] - Express response if called directly as middleware
 * @returns {import("express").RequestHandler|void}
 */
export function send(ent, res) {
  if (res && isFunction(res.status) && isFunction(res.json)) {
    return createSender()(/** @type {any} */ (ent), res);
  }
  return createSender(ent);
}

/**
 * @param {any} [ent]
 * @returns {import("express").RequestHandler}
 */
function createSender(ent) {
  const privateProps = getPrivateProps(ent).filter((p) => p !== "id");
  return function sendRows(_req, res) {
    const data = res.locals;
    const raw = isArray(data.rows) ? data.rows : data.history;
    if (!isArray(raw)) {
      return res.status(200).json({ rows: raw, total: data.total });
    }
    const allowed = data.aclFields;
    const scrubbed = isArray(privateProps, ">", 0)
      ? deleteProps(raw, privateProps).map((row) => {
          if (!isObject(row?.record)) return row;
          const [record] = deleteProps([{ ...row.record }], privateProps);
          return { ...row, record };
        })
      : raw;
    const rows = isSet(allowed) ? projectAcl(scrubbed, allowed) : scrubbed;
    const total = rows.length === raw.length ? data.total : rows.length;
    res.status(200).json({ rows, total });
  };
}
