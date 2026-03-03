CREATE TABLE IF NOT EXISTS consumer (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  nickname varchar(30) NOT NULL,
  "accessToken" varchar(600) NOT NULL UNIQUE,
  "refreshToken" varchar(600) NOT NULL UNIQUE,
  "roles" INT[] NOT NULL,
  archived BOOLEAN DEFAULT FALSE,
  "archivedAt" TIMESTAMP
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
);

CREATE INDEX IF NOT EXISTS idx_consumer_user_id ON consumer("userId");