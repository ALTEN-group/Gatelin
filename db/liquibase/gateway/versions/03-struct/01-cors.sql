
CREATE TABLE IF NOT EXISTS cors (
	id SERIAL PRIMARY KEY,
	name varchar(50) NOT NULL,
  description VARCHAR(100) NULL,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "creatorId" INT,
  "creatorName" TEXT,
  "updatedAt" TIMESTAMP NULL,
  "updaterId" INT,
  "updaterName" TEXT
);