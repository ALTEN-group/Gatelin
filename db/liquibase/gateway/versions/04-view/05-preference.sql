CREATE OR REPLACE VIEW preferences AS
  SELECT
    p.id,
    p."userId",
    p.resource,
    p.name,
    p.conf,
    p."isActive",
    p."updatedAt",
    p."updaterId",
    p."updaterName",
    p."createdAt",
    p."creatorId",
    p."creatorName"
  FROM preference AS p
  ORDER BY p.id ASC
;
