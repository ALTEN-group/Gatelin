CREATE TABLE IF NOT EXISTS color (
  id SERIAL PRIMARY KEY,
  name varchar(30) NOT NULL,
  code varchar(7) NOT NULL,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP NULL,
  UNIQUE (name),
  UNIQUE (code)
);
