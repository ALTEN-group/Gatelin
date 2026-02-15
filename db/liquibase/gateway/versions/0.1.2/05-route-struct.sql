CREATE TYPE method AS ENUM ('GET', 'PATCH', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS');

CREATE TABLE IF NOT EXISTS route (
	id SERIAL PRIMARY KEY,
  "resourceId" INT NOT NULL,
  "operationId" INT NOT NULL,
  description varchar(100) NULL,
  pattern varchar(50) NOT NULL,
  methods method[] NOT NULL,
  jwt BOOLEAN DEFAULT FALSE,
  locked BOOLEAN DEFAULT FALSE,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  CHECK ("resourceId">=0),
  CONSTRAINT fk_route_resource
		FOREIGN KEY ("resourceId") REFERENCES resource (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_route_operation
    FOREIGN KEY ("operationId") REFERENCES operation (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);