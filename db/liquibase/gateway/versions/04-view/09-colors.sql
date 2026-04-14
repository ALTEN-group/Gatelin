CREATE OR REPLACE VIEW colors AS
  SELECT
    id,
    name,
    code,
    archived,
    "archivedAt",
    "creatorName",
    "updaterName",
    "createdAt",
    "updatedAt",
    NULL::INT  AS "consumerId",
    NULL::TEXT AS "consumerName"
  FROM color;
