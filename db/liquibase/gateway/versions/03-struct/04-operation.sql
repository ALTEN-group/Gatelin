
CREATE TABLE IF NOT EXISTS operation (
	id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(100) NULL,
  color VARCHAR(7) NULL,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "creatorId" INT,
  "creatorName" TEXT,
  "updatedAt" TIMESTAMP NULL,
  "updaterId" INT,
  "updaterName" TEXT
);
