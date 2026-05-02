CREATE TABLE IF NOT EXISTS scope (
  id           SERIAL PRIMARY KEY,
  "routeId"    INT NOT NULL,
  name         VARCHAR(50) NOT NULL UNIQUE,
  core         BOOLEAN DEFAULT FALSE,
  archived     BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "createdAt"  TIMESTAMP DEFAULT NOW(),
  "creatorId"  INT,
  "creatorName" TEXT,
  "updatedAt"  TIMESTAMP NULL,
  "updaterId"  INT,
  "updaterName" TEXT,
  CHECK ("routeId" >= 0),
  CONSTRAINT fk_scope_route
    FOREIGN KEY ("routeId") REFERENCES route (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
