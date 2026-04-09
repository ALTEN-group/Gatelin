-- Create INSTEAD OF trigger function for scopes view
-- This function handles INSERT, UPDATE, DELETE operations on the scopes view
-- by converting them to operations on the underlying scope table
CREATE OR REPLACE FUNCTION iud_scope() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO scope ("routeId", name, "creatorId", "creatorName")
      VALUES (
        NEW."routeId",
        NEW.name,
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE scope
      SET
        "routeId" = COALESCE(NEW."routeId", "routeId"),
        name = COALESCE(NEW.name, name),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM soft_delete(''scope'', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
