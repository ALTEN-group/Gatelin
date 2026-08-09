CREATE OR REPLACE VIEW conditions AS
  SELECT
    c.id,
    c.name,
    c."fieldId",
    f.name AS "fieldName",
    c.op,
    c.value,
    c.color,
    c.archived,
    c."archivedAt",
    c."updatedAt",
    c."updaterId",
    c."updaterName",
    c."createdAt",
    c."creatorId",
    c."creatorName"
  FROM condition AS c
  LEFT JOIN field AS f ON f.id = c."fieldId"
  ORDER BY c.id ASC
;
