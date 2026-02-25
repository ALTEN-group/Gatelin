import { execute } from "@dwtechs/antity-pgsql";

/**
 * Creates a history getter middleware for a specific table
 * @param {string} tableName - The name of the table to retrieve history for
 * @returns {Function} Express middleware function
 */
function get(tableName) {
  return function(req, res, next) {
    const id = req.params.id;
    // log.debug(`getHistory(id=${id})`);
    if (!id) return next({ status: 400, msg: "Missing id" });

    query(tableName, id)
      .then((r) => {
        const { rowCount, rows } = r;
        if (!rowCount) return next({ status: 404, msg: "history not found" });
        res.locals.history = rows;
        res.locals.total = rowCount;
        next();
      })
      .catch((err) => next(err));
  };
}

/**
 * Retrieves the history for a given ID.
 *
 * @param {string} tableName - The name of the table to retrieve history for
 * @param {type} id - The ID for which to retrieve history.
 * @return {Promise} A promise that resolves with the history data.
 */
function query(tableName, id) {
  const sql = `
    SELECT id, tstamp, operation, "consumerId", "consumerName"
    FROM log.history
    WHERE "schemaName" = 'public' 
      AND "tableName" = $1
      AND CAST(record->>'id' AS INT) = $2
    ORDER BY tstamp ASC
  `;
  return execute(sql, [tableName, id], null);
}

export default {
  get,
};
