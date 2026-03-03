
CREATE TABLE IF NOT EXISTS cors (
	id SERIAL PRIMARY KEY,
	name varchar(50) NOT NULL,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);