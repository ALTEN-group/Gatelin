
CREATE TABLE IF NOT EXISTS "service" (
	id SERIAL PRIMARY KEY,
	name varchar(20) NOT NULL,
  description VARCHAR(100) NULL,
  pattern TEXT,
  core BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "creatorId" INT,
  "creatorName" TEXT,
  "updatedAt" TIMESTAMP NULL,
  "updaterId" INT,
  "updaterName" TEXT
);
