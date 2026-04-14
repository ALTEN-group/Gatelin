CREATE OR REPLACE VIEW roles AS
  SELECT
    r.id,
    r.name,
    r.description,
    r."colorId",
    c.name AS "colorName",
    r.active,
    r.archived,
    r."archivedAt",
    r."creatorName",
    r."updaterName",
    r."createdAt",
    r."updatedAt"
  FROM role r
  LEFT JOIN color c ON c.id = r."colorId";
