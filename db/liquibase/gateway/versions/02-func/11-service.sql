-- Create INSTEAD OF trigger function for services view
-- This function handles INSERT, UPDATE, DELETE operations on the services view
-- by converting them to operations on the underlying service table
CREATE OR REPLACE FUNCTION iud_service() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO service ("appId", name, pattern, locked, "creatorId", "creatorName")
      VALUES (
        NEW."appId",
        NEW.name,
        NEW.pattern,
        NEW.locked,
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE service
      SET
        "appId" = COALESCE(NEW."appId", "appId"),
        name = COALESCE(NEW.name, name),
        pattern = COALESCE(NEW.pattern, pattern),
        locked = COALESCE(NEW.locked, locked),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived(''service'', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
