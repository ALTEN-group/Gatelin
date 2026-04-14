-- Create INSTEAD OF trigger function for roles view
-- This function handles INSERT, UPDATE, DELETE operations on the roles view
-- by converting them to operations on the underlying role table
CREATE OR REPLACE FUNCTION iud_role() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO role (name, description, "colorId", active, "creatorId", "creatorName")
      VALUES (
        NEW.name,
        NEW.description,
        NEW."colorId",
        NEW.active,
        NEW."consumerId",
        NEW."consumerName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE role
      SET
        name = COALESCE(NEW.name, name),
        description = COALESCE(NEW.description, description),
        "colorId" = COALESCE(NEW."colorId", "colorId"),
        active = COALESCE(NEW.active, active),
        "updaterId" = NEW."consumerId",
        "updaterName" = NEW."consumerName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM soft_delete(''role'', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
