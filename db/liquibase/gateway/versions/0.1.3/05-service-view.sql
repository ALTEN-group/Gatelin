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
    s."creatorName"
  FROM service AS s
  ORDER BY s.id ASC
;
