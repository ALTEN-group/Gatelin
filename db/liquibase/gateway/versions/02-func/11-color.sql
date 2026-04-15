-- Create INSTEAD OF trigger function for colors view
-- This function handles INSERT, UPDATE, DELETE operations on the colors view
-- by converting them to operations on the underlying color table
CREATE OR REPLACE FUNCTION iud_color() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO color (name, code, "creatorId", "creatorName")
      VALUES (
        NEW.name,
        NEW.code,
        NEW."consumerId",
        NEW."consumerName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE color
      SET
        name = COALESCE(NEW.name, name),
        code = COALESCE(NEW.code, code),
        "updaterId" = NEW."consumerId",
        "updaterName" = NEW."consumerName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived(''color'', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
