CREATE TABLE IF NOT EXISTS field (
  id           SERIAL PRIMARY KEY,
  "resourceId" INT  NOT NULL,
  name         TEXT NOT NULL,
  core         BOOLEAN DEFAULT FALSE,
  archived     BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "createdAt"  TIMESTAMP DEFAULT NOW(),
  "creatorId"  INT,
  "creatorName" TEXT,
  "updatedAt"  TIMESTAMP NULL,
  "updaterId"  INT,
  "updaterName" TEXT,
  CHECK ("resourceId" >= 0),
  CONSTRAINT fk_field_resource
    FOREIGN KEY ("resourceId") REFERENCES resource (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
