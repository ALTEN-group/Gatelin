CREATE TYPE method AS ENUM ('GET', 'PATCH', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS');

CREATE TABLE IF NOT EXISTS cors (
	id SERIAL PRIMARY KEY,
	name varchar(50) NOT NULL,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);


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


CREATE TABLE IF NOT EXISTS api (
	id SERIAL PRIMARY KEY,
  "serviceId" INT NOT NULL,
	name varchar(20) NOT NULL,
  protected BOOLEAN DEFAULT FALSE,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CHECK ("serviceId">=0),
  CONSTRAINT fk_api_service
		FOREIGN KEY ("serviceId") REFERENCES service (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- CREATE TABLE IF NOT EXISTS service_cors (
--   "serviceId" INT NOT NULL,
--   "corsId" INT NOT NULL,
--   PRIMARY KEY ("serviceId", "corsId"),
--   UNIQUE ("serviceId", "corsId"),
--   CHECK ("serviceId">=0),
--   CHECK ("corsId">=0),
--   CONSTRAINT fk_cors_service
--     FOREIGN KEY ("serviceId") REFERENCES service (id)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE,
--   CONSTRAINT fk_service_cors
--     FOREIGN KEY ("corsId") REFERENCES cors (id)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE
-- );


CREATE TABLE IF NOT EXISTS route (
	id SERIAL PRIMARY KEY,
  "serviceId" INT NOT NULL,
  "apiId" INT NOT NULL,
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
  CHECK ("apiId">=0),
  CONSTRAINT fk_route_service
		FOREIGN KEY ("serviceId") REFERENCES service (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_route_api
		FOREIGN KEY ("apiId") REFERENCES api (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE
);