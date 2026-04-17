CREATE OR REPLACE VIEW preferences AS
  SELECT
    p.id,
    p."userId",
    p.resource,
    p.name,
    p.conf,
    p."isActive"
  FROM preference AS p
  ORDER BY p.id ASC
;
