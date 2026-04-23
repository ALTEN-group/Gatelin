CREATE OR REPLACE VIEW scopes AS
  SELECT
    s.id,
    s."routeId",
    r.name AS "routeName",
    res.name AS "resourceName",
    s.name,
    s.archived,
    s."archivedAt",
    s."updatedAt",
    s."updaterId",
    s."updaterName",
    s."createdAt",
    s."creatorId",
    s."creatorName"
  FROM scope AS s
  LEFT JOIN route AS r ON r.id = s."routeId"
  LEFT JOIN resource AS res ON res.id = r."resourceId"
  ORDER BY s.id ASC
;

