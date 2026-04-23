CREATE TABLE IF NOT EXISTS role (
  id SERIAL PRIMARY KEY,
  "appId" INT NOT NULL,
  name varchar(50) NOT NULL,
  description varchar(100) NULL,
  color VARCHAR(7) NULL,
  active BOOLEAN DEFAULT FALSE,
  locked BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CHECK ("appId" >= 0),
  CONSTRAINT fk_role_application
    FOREIGN KEY ("appId") REFERENCES application (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
