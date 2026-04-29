-- Limit function for preference table: prevents a user from exceeding 10 preferences per resource
CREATE OR REPLACE FUNCTION check_preference_limit() RETURNS trigger AS $$
  DECLARE
    pref_count INT;
  BEGIN
    SELECT COUNT(*) INTO pref_count
    FROM preference
    WHERE "userId" = NEW."userId" AND resource = NEW.resource;

    IF pref_count >= 10 THEN
      RAISE EXCEPTION 'Preference limit reached: a user cannot have more than 10 preferences per table.';
    END IF;

    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
