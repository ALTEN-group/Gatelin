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
    c."creatorId",
    c."creatorName",
    c."updatedAt",
    c."updaterId",
    c."updaterName"
  FROM consumer AS c ORDER BY c.id ASC;
