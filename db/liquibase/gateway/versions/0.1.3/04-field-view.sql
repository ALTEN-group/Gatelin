CREATE OR REPLACE VIEW fields AS
  SELECT
    f.id,
    f."resourceId",
    r.name AS "resourceName",
    f.name,
    f.locked,
    f.archived,
    f."archivedAt",
    f."updatedAt",
    f."updaterId",
    f."updaterName",
    f."createdAt",
    f."creatorId",
    f."creatorName"
  FROM field AS f
  LEFT JOIN resource AS r ON r.id = f."resourceId"
  ORDER BY f.id ASC
;

