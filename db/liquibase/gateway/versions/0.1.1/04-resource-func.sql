-- Create INSTEAD OF trigger function for apis view
-- This function handles INSERT, UPDATE, DELETE operations on the resources view
-- by converting them to operations on the underlying resource table
CREATE OR REPLACE FUNCTION iud_resource() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO resource ("serviceId", name, protected, "creatorId", "creatorName")
      VALUES (
        NEW."serviceId",
        NEW.name,
        NEW.protected,
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;
      
    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE resource
      SET 
        "serviceId" = COALESCE(NEW."serviceId", "serviceId"),
        name = COALESCE(NEW.name, name),
        protected = COALESCE(NEW.protected, protected)
      WHERE id = NEW.id;
      RETURN NEW;
      
    ELSIF TG_OP = ''DELETE'' THEN
      DELETE FROM resource WHERE id = OLD.id;
      RETURN OLD;
    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
