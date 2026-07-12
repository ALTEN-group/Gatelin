CREATE TABLE IF NOT EXISTS role (
  id SERIAL PRIMARY KEY,
  "appId" INT NOT NULL,
  name varchar(50) NOT NULL,
  description varchar(100) NULL,
  color VARCHAR(7) NULL,
  locked BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "creatorId" INT,
  "creatorName" TEXT,
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "updaterId" INT,
  "updaterName" TEXT,
  CHECK ("appId" >= 0),
  CONSTRAINT fk_role_application
    FOREIGN KEY ("appId") REFERENCES application (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
