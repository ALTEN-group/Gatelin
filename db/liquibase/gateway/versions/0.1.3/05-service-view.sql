CREATE OR REPLACE VIEW services AS
  SELECT
    s.id,
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
    s."creatorName",
    NULL::INT  AS "consumerId",
    NULL::TEXT AS "consumerName"
  FROM service AS s
  ORDER BY s.id ASC
;
