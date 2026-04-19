CREATE TABLE IF NOT EXISTS method_color (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP NULL
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
    FOREIGN KEY ("methodId") REFERENCES method_color (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
