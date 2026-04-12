CREATE TABLE preference (
  id             SERIAL      PRIMARY KEY,
  "userId"       INT         NOT NULL,
  resource       VARCHAR(60) NOT NULL,
  name           VARCHAR(60) NOT NULL,
  conf           JSONB       NOT NULL,
  "isActive"     BOOLEAN     NOT NULL DEFAULT false,
  UNIQUE ("userId", resource, name)   -- still prevent duplicates
);

CREATE OR REPLACE FUNCTION check_preference_limit() RETURNS trigger AS '
  DECLARE
    pref_count INT;
  BEGIN
    SELECT COUNT(*) INTO pref_count
    FROM preference
    WHERE "userId" = NEW."userId" AND resource = NEW.resource;

    IF pref_count >= 10 THEN
      RAISE EXCEPTION ''Preference limit reached: a user cannot have more than 10 preferences per table.'';
    END IF;

    RETURN NEW;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_preference_limit
  BEFORE INSERT ON preference
  FOR EACH ROW EXECUTE FUNCTION check_preference_limit();