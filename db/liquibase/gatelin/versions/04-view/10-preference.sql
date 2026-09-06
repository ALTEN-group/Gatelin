CREATE OR REPLACE VIEW preferences AS
  SELECT
    p.id,
    p."userId",
    p."resourceId",
    r.name AS "resourceName",
    p.name,
    p.conf,
    (p."userId" IS NULL) AS locked,
    false AS "isActive", -- write-only: set true on UPDATE to select this preference for the acting user (see iud_preference())
    p."createdAt",
    p."creatorId",
    p."creatorName",
    p."updatedAt",
    p."updaterId",
    p."updaterName"
  FROM preference AS p
  LEFT JOIN resource AS r ON r.id = p."resourceId"
  ORDER BY p.id ASC
;
