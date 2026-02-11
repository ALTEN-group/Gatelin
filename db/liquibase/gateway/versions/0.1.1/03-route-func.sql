
-- Create INSTEAD OF trigger function for routes view
-- This function handles INSERT, UPDATE, DELETE operations on the routes view
-- by converting them to operations on the underlying route table
CREATE OR REPLACE FUNCTION iud_route() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO route ("resourceId", description, pattern, methods, jwt, protected, "creatorId", "creatorName")
      VALUES (
        NEW."resourceId",
        NEW.description,
        NEW.pattern,
        NEW.methods,
        NEW.jwt,
        NEW.protected,
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;
      
    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE route 
      SET 
        "resourceId" = COALESCE(NEW."resourceId", "resourceId"),
        description = COALESCE(NEW.description, description),
        pattern = COALESCE(NEW.pattern, pattern),
        methods = COALESCE(NEW.methods, methods),
        jwt = COALESCE(NEW.jwt, jwt),
        protected = COALESCE(NEW.protected, protected)
      WHERE id = NEW.id;
      RETURN NEW;
      
    ELSIF TG_OP = ''DELETE'' THEN
      DELETE FROM route WHERE id = OLD.id;
      RETURN OLD;
    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
