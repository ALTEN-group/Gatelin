CREATE TABLE IF NOT EXISTS route (
	id SERIAL PRIMARY KEY,
  "resourceId" INT NOT NULL,
  pattern varchar(50) NOT NULL,
  name varchar(50) NULL,
  description varchar(100) NULL,
  protected BOOLEAN DEFAULT FALSE,
  core BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "creatorId" INT,
  "creatorName" TEXT,
  "updatedAt" TIMESTAMP NULL,
  "updaterId" INT,
  "updaterName" TEXT,
  CHECK ("resourceId">=0),
  CONSTRAINT fk_route_resource
		FOREIGN KEY ("resourceId") REFERENCES resource (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS route_operation (
  "routeId" INT NOT NULL,
  "operationId" INT NOT NULL,
  PRIMARY KEY ("routeId", "operationId"),
  CONSTRAINT fk_route_operation_route
    FOREIGN KEY ("routeId") REFERENCES route (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_route_operation_operation
    FOREIGN KEY ("operationId") REFERENCES operation (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);