
CREATE TABLE IF NOT EXISTS resource (
	id SERIAL PRIMARY KEY,
  "serviceId" INT NOT NULL,
	name varchar(20) NOT NULL,
  protected BOOLEAN DEFAULT FALSE,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  -- "createdAt" TIMESTAMP DEFAULT NOW(),
  -- "updatedAt" TIMESTAMP DEFAULT NOW(),
  CHECK ("serviceId">=0),
  CONSTRAINT fk_resource_service
		FOREIGN KEY ("serviceId") REFERENCES service (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE
);