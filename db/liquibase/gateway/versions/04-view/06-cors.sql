CREATE OR REPLACE VIEW cors_list AS
  SELECT
    c.id,
    c.name,
    c.archived,
    c."archivedAt",
    c."updatedAt",
    c."updaterId",
    c."updaterName",
    c."createdAt",
    c."creatorId",
    c."creatorName",
    NULL::INT  AS "consumerId",
    NULL::TEXT AS "consumerName"
  FROM cors AS c
  ORDER BY c.id ASC
;
