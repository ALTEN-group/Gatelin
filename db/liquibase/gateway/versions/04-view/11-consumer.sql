CREATE OR REPLACE VIEW consumers AS
  SELECT
    c.id,
    c."userId",
    c.nickname,
    c."accessToken",
    c."refreshToken",
    c.roles,
    c.archived,
    c."archivedAt",
    c."createdAt",
    c."updatedAt",
    NULL::INT  AS "consumerId",
    NULL::TEXT AS "consumerName"
  FROM consumer AS c ORDER BY c.id ASC;
