CREATE TABLE IF NOT EXISTS scope (
  id           SERIAL PRIMARY KEY,
  "routeId"    INT NOT NULL,
  name         VARCHAR(50) NOT NULL UNIQUE,
  archived     BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "creatorId"  INT,
  "creatorName" TEXT,
  "updaterId"  INT,
  "updaterName" TEXT,
  CHECK ("routeId" >= 0),
  CONSTRAINT fk_scope_route
    FOREIGN KEY ("routeId") REFERENCES route (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
