import { execute } from "@dwtechs/antity-pgsql";

const ALLOWED_HISTORY_FIELDS = new Set(["routeId"]);

/**
 * Groups history rows that belong to the same logical action (e.g. a route
 * update that also rewrites its route_operation/route_method junction rows)
 * into a single entry.
 *
 * Rows are grouped by (tstamp, consumerUserId, record.id): Postgres `now()` is
 * transaction-stable so every row written by the same transaction shares the
 * same tstamp, and record.id (the audited entity's own id, reused by
 * junction-table history rows) keeps unrelated records apart when several
 * of them are updated in a single bulk transaction. Merged group keeps the
 * first row's id/operation/tstamp/consumerName and combines all `record`
 * fields into one object.
 * @param {Array<object>} rows - rows returned by query()/queryByField(), ordered by tstamp ASC, id ASC
 * @returns {Array<object>} grouped history entries
 */
function groupByAction(rows) {
  const groups = new Map();
  for (const row of rows) {
    const tstamp =
      row.tstamp instanceof Date ? row.tstamp.toISOString() : row.tstamp;
    const key = `${tstamp}_${row.consumerUserId}_${row.record?.id}`;
    const group = groups.get(key);
    if (!group)
      groups.set(key, {
        id: row.id,
        tstamp: row.tstamp,
        operation: row.operation,
        consumerUserId: row.consumerUserId,
        consumerName: row.consumerName,
        record: { ...row.record },
      });
    else Object.assign(group.record, row.record);
  }
  return [...groups.values()];
}

/**
 * Creates a history getter middleware for a specific table
 * @param {string|string[]} tableName - The name(s) of the table(s) to retrieve history for
 * @param {string} [schema='public'] - The schema name (defaults to 'public')
 * @returns {Function} Express middleware function
 */
function get(tableName, schema = "public") {
  return (req, res, next) => {
    const id = req.params.id;
    // log.debug(`getHistory(id=${id})`);
    if (!id) return next({ status: 400, msg: "Missing id" });

    query(tableName, id, schema)
      .then((r) => {
        if (!r.rowCount) return next({ status: 404, msg: "history not found" });
        const rows = groupByAction(r.rows);
        if (rows.length === 1 && rows[0].operation === "INSERT")
          return next({ status: 404, msg: "history not found" });
        res.locals.rows = rows;
        res.locals.total = rows.length;
        next();
      })
      .catch((err) => next(err));
  };
}

/**
 * Retrieves the history for a given ID.
 *
 * @param {string|string[]} tableName - The name(s) of the table(s) to retrieve history for
 * @param {type} id - The ID for which to retrieve history.
 * @param {string} [schema='public'] - The schema name (defaults to 'public')
 * @return {Promise} A promise that resolves with the history data.
 */
function query(tableName, id, schema = "public") {
  const tableNames = Array.isArray(tableName) ? tableName : [tableName];
  const sql = `
    SELECT id, tstamp, operation, "consumerUserId", "consumerName", record
    FROM log.history
    WHERE "schemaName" = $1 
      AND "tableName" = ANY($2::text[])
      AND CAST(record->>'id' AS INT) = $3
    ORDER BY tstamp ASC, id ASC
  `;
  return execute(sql, [schema, tableNames, id], null);
}

function getByField(tableName, field, schema = "public") {
  return (req, res, next) => {
    const value = req.params[field];
    if (!value) return next({ status: 400, msg: `Missing ${field}` });

    queryByField(tableName, field, value, schema)
      .then((r) => {
        if (!r.rowCount) return next({ status: 404, msg: "history not found" });
        const rows = groupByAction(r.rows);
        if (rows.length === 1 && rows[0].operation === "INSERT")
          return next({ status: 404, msg: "history not found" });
        res.locals.rows = rows;
        res.locals.total = rows.length;
        next();
      })
      .catch((err) => next(err));
  };
}

function queryByField(tableName, field, value, schema = "public") {
  if (!ALLOWED_HISTORY_FIELDS.has(field))
    throw new Error(`Invalid history field: ${field}`);
  const tableNames = Array.isArray(tableName) ? tableName : [tableName];
  const sql = `
    SELECT id, tstamp, operation, "consumerUserId", "consumerName", record
    FROM log.history
    WHERE "schemaName" = $1
      AND "tableName" = ANY($2::text[])
      AND CAST(record->>'${field}' AS INT) = $3
    ORDER BY tstamp ASC, id ASC
  `;
  return execute(sql, [schema, tableNames, value], null);
}

export default {
  get,
  getByField,
  groupByAction,
};
