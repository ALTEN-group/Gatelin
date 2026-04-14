create or replace view resources AS
  SELECT r.id,
  r."serviceId",
  s.name as "serviceName",
  r.name,
  r.locked,
  r.archived,
  r."updatedAt",
  r."updaterId",
  r."updaterName",
  r."createdAt",
  r."creatorId",
  r."creatorName",
  NULL::INT  AS "consumerId",
  NULL::TEXT AS "consumerName"
  FROM "resource" AS r
  LEFT OUTER JOIN "service" as s ON r."serviceId" = s.id
  ORDER BY r.id ASC
;

