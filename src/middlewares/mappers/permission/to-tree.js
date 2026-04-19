// @ts-check

/**
 * Express middleware that transforms flat permission rows from the DB view
 * into a tree structure grouped by service → resource → route.
 * Permissions are always filtered by a single roleId, so it is hoisted
 * to the top level instead of being repeated on every leaf node.
 *
 * Input (res.locals.rows):
 *   [{ id, roleId, routeId, serviceName, resourceName, routeName, operationId[], operationName[], fields, ... }]
 *
 * Output (res.locals.rows):
 *   [{ roleId, services: [{ serviceName, children: [{ resourceName, children: [{ id, routeId, routeName, operationId[], operationName[], fields }] }] }] }]
 *
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function permissionsToTree(_req, res, next) {
  const rows = res.locals.rows ?? [];

  if (rows.length === 0) {
    res.locals.rows = [];
    return next();
  }

  const roleId = rows[0].roleId;

  /** @type {Map<string, Map<string, Array<object>>>} */
  const serviceMap = new Map();

  for (const row of rows) {
    const svc = row.serviceName ?? "";
    const resource = row.resourceName ?? "";

    if (!serviceMap.has(svc)) serviceMap.set(svc, new Map());
    const resMap = serviceMap.get(svc);

    if (!resMap.has(resource)) resMap.set(resource, []);
    resMap.get(resource).push({
      id: row.id,
      routeId: row.routeId,
      routeName: row.routeName,
      operationId: row.operationId,
      operationName: row.operationName,
      fields: row.fields,
      archived: row.archived,
      archivedAt: row.archivedAt,
    });
  }

  const services = [];
  for (const [svcName, resMap] of serviceMap) {
    const resources = [];
    for (const [resName, routes] of resMap) {
      resources.push({ resourceName: resName, children: routes });
    }
    services.push({ serviceName: svcName, children: resources });
  }

  res.locals.rows = [{ roleId, services }];
  next();
}

export { permissionsToTree };
