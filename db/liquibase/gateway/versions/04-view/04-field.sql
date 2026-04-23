CREATE OR REPLACE VIEW fields AS
  SELECT
    f.id,
    f."resourceId",
    r.name AS "resourceName",
    s.name AS "serviceName",
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
  LEFT JOIN service AS s ON s.id = r."serviceId"
  ORDER BY f.id ASC
;

