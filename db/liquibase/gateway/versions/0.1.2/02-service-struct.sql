
CREATE TABLE IF NOT EXISTS "service" (
	id SERIAL PRIMARY KEY,
	name varchar(20) NOT NULL,
  protected BOOLEAN DEFAULT FALSE,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
