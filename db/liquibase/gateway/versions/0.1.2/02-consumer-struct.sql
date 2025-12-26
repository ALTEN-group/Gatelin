CREATE TABLE IF NOT EXISTS consumer (
  id SERIAL PRIMARY KEY,
  userId INT NOT NULL UNIQUE,
  nickname varchar(30) NOT NULL,
  "accessToken" varchar(600) NOT NULL UNIQUE,
  "refreshToken" varchar(600) NOT NULL UNIQUE,
  "rolesArrayAgg" INT[] NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);