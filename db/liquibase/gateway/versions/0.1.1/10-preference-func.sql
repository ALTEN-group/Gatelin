-- Create INSTEAD OF trigger function for preferences view
-- This function handles INSERT, UPDATE, DELETE operations on the preferences view
-- by converting them to operations on the underlying preference table
CREATE OR REPLACE FUNCTION iud_preference() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO preference ("userId", resource, name, conf, "isActive")
      VALUES (
        NEW."userId",
        NEW.resource,
        NEW.name,
        NEW.conf,
        NEW."isActive"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE preference
      SET
        name     = COALESCE(NEW.name,     name),
        conf     = COALESCE(NEW.conf,     conf),
        "isActive" = COALESCE(NEW."isActive", "isActive")
      WHERE id = NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''DELETE'' THEN
      DELETE FROM preference WHERE id = OLD.id;
      RETURN OLD;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
