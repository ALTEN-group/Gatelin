CREATE TABLE IF NOT EXISTS method (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "creatorId" INT,
  "creatorName" TEXT,
  "updatedAt" TIMESTAMP NULL,
  "updaterId" INT,
  "updaterName" TEXT
);

CREATE TABLE IF NOT EXISTS route_method (
  "routeId" INT NOT NULL,
  "methodId" INT NOT NULL,
  PRIMARY KEY ("routeId", "methodId"),
  CONSTRAINT fk_route_method_route
    FOREIGN KEY ("routeId") REFERENCES route (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_route_method_method
    FOREIGN KEY ("methodId") REFERENCES method (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
