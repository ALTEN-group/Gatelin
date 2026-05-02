
CREATE TABLE IF NOT EXISTS resource (
	id SERIAL PRIMARY KEY,
  "serviceId" INT NOT NULL,
	name varchar(20) NOT NULL,
  description VARCHAR(100) NULL,
  core BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "creatorId" INT,
  "creatorName" TEXT,
  "updatedAt" TIMESTAMP NULL,
  "updaterId" INT,
  "updaterName" TEXT,
  CHECK ("serviceId">=0),
  CONSTRAINT fk_resource_service
		FOREIGN KEY ("serviceId") REFERENCES service (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE
);