CREATE TABLE IF NOT EXISTS scopes (
  id           SERIAL PRIMARY KEY,
  value        VARCHAR(50) NOT NULL,
  locked       BOOLEAN DEFAULT FALSE,
  archived     BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "creatorId"   INT,
  "creatorName" TEXT,
  "updaterId"   INT,
  "updaterName" TEXT
);
