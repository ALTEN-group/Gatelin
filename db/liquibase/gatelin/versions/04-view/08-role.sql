CREATE OR REPLACE VIEW roles AS
  SELECT
    r.id,
    r."appId",
    a.name AS "appName",
    r.name,
    r.description,
    r.color,
    r.archived,
    r."archivedAt",
    r."updaterId",
    r."updaterName",
    r."updatedAt",
    r."creatorId",
    r."creatorName",
    r."createdAt"
  FROM role r
  LEFT JOIN application a ON a.id = r."appId"
  ORDER BY r.id ASC;
