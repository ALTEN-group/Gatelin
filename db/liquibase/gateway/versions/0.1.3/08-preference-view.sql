CREATE OR REPLACE VIEW preferences AS
  SELECT
    p.id,
    p."userId",
    p.resource,
    p.name,
    p.conf,
    p."isActive",
    NULL::INT  AS "consumerId",
    NULL::TEXT AS "consumerName"
  FROM preference AS p
  ORDER BY p.id ASC
;
