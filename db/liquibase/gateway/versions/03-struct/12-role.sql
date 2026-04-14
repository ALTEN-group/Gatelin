CREATE TABLE IF NOT EXISTS role (
  id SERIAL PRIMARY KEY,
  name varchar(50) NOT NULL,
  description varchar(100) NULL,
  "colorId" INT NULL,
  active BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_role_color
    FOREIGN KEY ("colorId") REFERENCES color (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
