-- Create INSTEAD OF trigger function for cors_list view
-- This function handles INSERT, UPDATE, DELETE operations on the cors_list view
-- by converting them to operations on the underlying cors table
CREATE OR REPLACE FUNCTION iud_cors() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO cors (name, "creatorId", "creatorName")
      VALUES (
        NEW.name,
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE cors
      SET
        name = COALESCE(NEW.name, name),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM soft_delete(''cors'', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
