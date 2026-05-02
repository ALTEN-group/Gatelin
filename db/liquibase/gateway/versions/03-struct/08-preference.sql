CREATE TABLE preference (
  id              SERIAL      PRIMARY KEY,
  "userId"        INT         NOT NULL,
  resource        VARCHAR(60) NOT NULL,
  name            VARCHAR(60) NOT NULL,
  conf            JSONB       NOT NULL,
  "isActive"      BOOLEAN     NOT NULL DEFAULT false,
  locked          BOOLEAN     NOT NULL DEFAULT false,
  "createdAt"     TIMESTAMP   DEFAULT NOW(),
  "creatorId"     INT         NULL,
  "creatorName"   TEXT        NULL,
  "updatedAt"     TIMESTAMP   NULL,
  "updaterId"     INT         NULL,
  "updaterName"   TEXT        NULL,
  UNIQUE ("userId", resource, name)
);