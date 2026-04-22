
CREATE TABLE IF NOT EXISTS "service" (
	id SERIAL PRIMARY KEY,
  "appId" INT NULL,
  CONSTRAINT fk_service_application FOREIGN KEY ("appId") REFERENCES application(id) ON DELETE RESTRICT ON UPDATE CASCADE,
	name varchar(20) NOT NULL,
  pattern TEXT,
  locked BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP NULL
);
