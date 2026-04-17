
-- Create INSTEAD OF trigger function for routes view
-- This function handles INSERT, UPDATE, DELETE operations on the routes view
-- by converting them to operations on the underlying route table
CREATE OR REPLACE FUNCTION iud_route() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO route ("resourceId", name, description, pattern, methods, "isProtected", locked, "creatorId", "creatorName")
      VALUES (
        NEW."resourceId",
        NEW.name,
        NEW.description,
        NEW.pattern,
        ARRAY(SELECT json_array_elements_text(NEW.methods))::method[],
        NEW."isProtected",
        NEW.locked,
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE route
      SET
        "resourceId" = COALESCE(NEW."resourceId", "resourceId"),
        name = COALESCE(NEW.name, name),
        description = COALESCE(NEW.description, description),
        pattern = COALESCE(NEW.pattern, pattern),
        methods = COALESCE(ARRAY(SELECT json_array_elements_text(NEW.methods))::method[], methods),
        "isProtected" = COALESCE(NEW."isProtected", "isProtected"),
        locked = COALESCE(NEW.locked, locked),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived(''route'', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
