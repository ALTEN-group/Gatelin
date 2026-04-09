CREATE OR REPLACE VIEW scopes AS
  SELECT
    s.id,
    s."routeId",
    r.name AS "routeName",
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
  ORDER BY s.id ASC
;

