CREATE TABLE preference (
  id             SERIAL      PRIMARY KEY,
  "userId"       INT         NOT NULL,
  resource       VARCHAR(60) NOT NULL,
  name           VARCHAR(60) NOT NULL,
  conf           JSONB       NOT NULL,
  "isActive"     BOOLEAN     NOT NULL DEFAULT false,
  UNIQUE ("userId", resource, name)   -- still prevent duplicates
);