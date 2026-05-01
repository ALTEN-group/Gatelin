CREATE TABLE IF NOT EXISTS field (
  id           SERIAL PRIMARY KEY,
  "resourceId" INT  NOT NULL,
  name         TEXT NOT NULL,
  core         BOOLEAN DEFAULT FALSE,
  archived     BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "creatorId"  INT,
  "creatorName" TEXT,
  "updaterId"  INT,
  "updaterName" TEXT,
  "createdAt"  TIMESTAMP DEFAULT NOW(),
  "updatedAt"  TIMESTAMP NULL,
  CHECK ("resourceId" >= 0),
  CONSTRAINT fk_field_resource
    FOREIGN KEY ("resourceId") REFERENCES resource (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
