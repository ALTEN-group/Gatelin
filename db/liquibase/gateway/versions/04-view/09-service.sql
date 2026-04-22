CREATE OR REPLACE VIEW services AS
  SELECT s.id,
  s."appId",
  app.name AS "appName",
  s.name,
  s.pattern,
  s.locked,
  s.archived,
  s."archivedAt",
  s."updatedAt",
  s."updaterId",
  s."updaterName",
  s."createdAt",
  s."creatorId",
  s."creatorName"
  FROM "service" AS s
  LEFT OUTER JOIN "application" AS app ON s."appId" = app.id
  ORDER BY s.id ASC
;
