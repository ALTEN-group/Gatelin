CREATE TABLE IF NOT EXISTS permission (
  id            SERIAL PRIMARY KEY,
  "roleId"      INT NOT NULL,
  "routeId"     INT NOT NULL,
  fields        TEXT[],
  scopes        TEXT[],
  "creatorId"   INT,
  "creatorName" TEXT,
  "updaterId"   INT,
  "updaterName" TEXT,
  "createdAt"   TIMESTAMP DEFAULT NOW(),
  "updatedAt"   TIMESTAMP NULL,
  CONSTRAINT permission_unique UNIQUE ("roleId", "routeId"),
  CHECK ("roleId">=0),
  CHECK ("routeId">=0),
  CONSTRAINT fk_permission_role
    FOREIGN KEY ("roleId") REFERENCES role (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_permission_route
    FOREIGN KEY ("routeId") REFERENCES route (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
