CREATE TABLE IF NOT EXISTS consumer (
  id SERIAL PRIMARY KEY,
  nickname varchar(30) NOT NULL,
  "accessToken" varchar(600) NOT NULL UNIQUE,
  "refreshToken" varchar(600) NOT NULL UNIQUE,
  roles INT[] NOT NULL,
  "creatorId" INT,
  "creatorName" TEXT,
  "updaterId" INT,
  "updaterName" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);