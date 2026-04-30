CREATE TABLE IF NOT EXISTS permission (
  id            SERIAL PRIMARY KEY,
  "roleId"      INT NOT NULL,
  "routeId"     INT NOT NULL,
  "operationId" INT NOT NULL,
  fields        TEXT[],
  scopes        TEXT[],
  conditions    JSON,
  "creatorId"   INT,
  "creatorName" TEXT,
  "updaterId"   INT,
  "updaterName" TEXT,
  "createdAt"   TIMESTAMP DEFAULT NOW(),
  "updatedAt"   TIMESTAMP NULL,
  CONSTRAINT permission_unique UNIQUE ("roleId", "routeId", "operationId"),
  CHECK ("roleId">=0),
  CHECK ("routeId">=0),
  CHECK ("operationId">=0),
  CONSTRAINT fk_permission_route_operation
    FOREIGN KEY ("routeId", "operationId") REFERENCES route_operation ("routeId", "operationId")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
