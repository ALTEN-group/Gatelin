import { execute } from "@dwtechs/antity-pgsql";

const ALLOWED_HISTORY_FIELDS = new Set(["routeId"]);

/**
 * Creates a history getter middleware for a specific table
 * @param {string|string[]} tableName - The name(s) of the table(s) to retrieve history for
 * @param {string} [schema='public'] - The schema name (defaults to 'public')
 * @returns {Function} Express middleware function
 */
function get(tableName, schema = "public") {
  return function (req, res, next) {
    const id = req.params.id;
    // log.debug(`getHistory(id=${id})`);
    if (!id) return next({ status: 400, msg: "Missing id" });

    query(tableName, id, schema)
      .then((r) => {
        const { rowCount, rows } = r;
        if (!rowCount) return next({ status: 404, msg: "history not found" });
        if (rowCount === 1 && rows[0].operation === "INSERT")
          return next({ status: 404, msg: "history not found" });
        res.locals.rows = rows;
        res.locals.total = rowCount;
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
    SELECT id, tstamp, operation, "consumerId", "consumerName", record
    FROM log.history
    WHERE "schemaName" = $1 
      AND "tableName" = ANY($2::text[])
      AND CAST(record->>'id' AS INT) = $3
    ORDER BY tstamp ASC
  `;
  return execute(sql, [schema, tableNames, id], null);
}

function getByField(tableName, field, schema = "public") {
  return function (req, res, next) {
    const value = req.params[field];
    if (!value) return next({ status: 400, msg: `Missing ${field}` });

    queryByField(tableName, field, value, schema)
      .then((r) => {
        const { rowCount, rows } = r;
        if (!rowCount) return next({ status: 404, msg: "history not found" });
        if (rowCount === 1 && rows[0].operation === "INSERT")
          return next({ status: 404, msg: "history not found" });
        res.locals.rows = rows;
        res.locals.total = rowCount;
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
    SELECT id, tstamp, operation, "consumerId", "consumerName", record
    FROM log.history
    WHERE "schemaName" = $1
      AND "tableName" = ANY($2::text[])
      AND CAST(record->>'${field}' AS INT) = $3
    ORDER BY tstamp ASC
  `;
  return execute(sql, [schema, tableNames, value], null);
}

export default {
  get,
  getByField,
};
