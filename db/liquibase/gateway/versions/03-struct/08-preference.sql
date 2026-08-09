-- "userId" NULL = template (built-in, shared) row; NOT NULL = a specific user's own preference
CREATE TABLE preference (
  id              SERIAL      PRIMARY KEY,
  "userId"        INT         NULL,
  "resourceId"    INT         NOT NULL,
  name            VARCHAR(60) NOT NULL,
  conf            JSONB       NOT NULL,
  "createdAt"     TIMESTAMP   DEFAULT NOW(),
  "creatorId"     INT,
  "creatorName"   TEXT,
  "updatedAt"     TIMESTAMP   NULL,
  "updaterId"     INT,
  "updaterName"   TEXT,
  CONSTRAINT fk_preference_resource
    FOREIGN KEY ("resourceId") REFERENCES resource (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- UNIQUE() with a nullable column doesn't enforce uniqueness across NULLs in Postgres,
-- so template rows and per-user rows each need their own partial unique index.
CREATE UNIQUE INDEX ux_preference_template_name ON preference ("resourceId", name) WHERE "userId" IS NULL;
CREATE UNIQUE INDEX ux_preference_user_name ON preference ("userId", "resourceId", name) WHERE "userId" IS NOT NULL;

-- Tracks which preference (template or personal, "preferenceId" -> preference.id) is currently
-- selected/active for a given user on a given resource. One row per user per resource.
CREATE TABLE preference_selection (
  "userId"       INT NOT NULL,
  "resourceId"   INT NOT NULL,
  "preferenceId" INT NOT NULL,
  PRIMARY KEY ("userId", "resourceId"),
  CONSTRAINT fk_preference_selection_resource
    FOREIGN KEY ("resourceId") REFERENCES resource (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_preference_selection_preference
    FOREIGN KEY ("preferenceId") REFERENCES preference (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);