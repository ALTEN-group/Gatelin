CREATE OR REPLACE VIEW operations AS
  SELECT
    o.id,
    o.name,
    o.description,
    o.archived,
    o."archivedAt",
    o."updatedAt",
    o."updaterId",
    o."updaterName",
    o."createdAt",
    o."creatorId",
    o."creatorName"
  FROM operation AS o
  ORDER BY o.id ASC
;
