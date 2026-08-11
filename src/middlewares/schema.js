// @ts-check

/**
 * Creates a schema getter middleware for a specific entity.
 * Returns a filtered projection of the entity's properties,
 * excluding private fields and internal implementation details.
 * @param {Object} entity - The SQLEntity instance to retrieve schema for
 * @returns {Function} Express middleware function
 */
function get(entity) {
  return (_req, res, next) => {
    const rows = entity.properties
      .filter((p) => !p.isPrivate)
      .map(
        ({ key, type, min, max, operations, requiredFor, isFilterable }) => ({
          key,
          type,
          min,
          max,
          operations,
          requiredFor,
          isFilterable,
        }),
      );
    res.locals.rows = rows;
    res.locals.total = rows.length;
    next();
  };
}

export default { get };
