CREATE TABLE IF NOT EXISTS condition (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  "fieldId"     INT NOT NULL,
  op            VARCHAR(10)  NOT NULL,
  value         TEXT         NOT NULL,
  CONSTRAINT fk_condition_field
    FOREIGN KEY ("fieldId") REFERENCES field (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  archived      BOOLEAN DEFAULT FALSE,
  "archivedAt"  TIMESTAMP,
  "creatorId"   INT,
  "creatorName" TEXT,
  "updaterId"   INT,
  "updaterName" TEXT,
  "createdAt"   TIMESTAMP DEFAULT NOW(),
  "updatedAt"   TIMESTAMP NULL
);
