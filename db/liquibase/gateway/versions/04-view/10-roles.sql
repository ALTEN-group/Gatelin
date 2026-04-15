CREATE OR REPLACE VIEW roles AS
  SELECT
    r.id,
    r.name,
    r.description,
    r.color,
    r.active,
    r.archived,
    r."archivedAt",
    r."creatorName",
    r."updaterName",
    r."createdAt",
    r."updatedAt",
    NULL::INT  AS "consumerId",
    NULL::TEXT AS "consumerName"
  FROM role r;
