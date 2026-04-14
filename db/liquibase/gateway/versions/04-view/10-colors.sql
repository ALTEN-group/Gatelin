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
    "updatedAt"
  FROM color;
