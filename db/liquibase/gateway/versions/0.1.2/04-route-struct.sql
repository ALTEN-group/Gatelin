CREATE TYPE method AS ENUM ('GET', 'PATCH', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS');

CREATE TABLE IF NOT EXISTS route (
	id SERIAL PRIMARY KEY,
  "serviceId" INT NOT NULL,
  "resourceId" INT NOT NULL,
  action varchar(20) NOT NULL,
  description varchar(100) NULL,
  pattern varchar(50) NOT NULL,
  methods method[] NOT NULL,
  jwt BOOLEAN DEFAULT FALSE,
  protected BOOLEAN DEFAULT FALSE,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  CHECK ("serviceId">=0),
  CHECK ("resourceId">=0),
  CONSTRAINT fk_route_service
		FOREIGN KEY ("serviceId") REFERENCES service (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_route_resource
		FOREIGN KEY ("resourceId") REFERENCES resource (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE
);