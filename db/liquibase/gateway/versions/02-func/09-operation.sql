-- Create INSTEAD OF trigger function for operations view
-- This function handles INSERT, UPDATE, DELETE operations on the operations view
-- by converting them to operations on the underlying operation table
CREATE OR REPLACE FUNCTION iud_operation() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO operation (name, description, "creatorId", "creatorName")
      VALUES (
        NEW.name,
        NEW.description,
        NEW."consumerId",
        NEW."consumerName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE operation
      SET
        name = COALESCE(NEW.name, name),
        description = COALESCE(NEW.description, description),
        "updaterId" = NEW."consumerId",
        "updaterName" = NEW."consumerName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM soft_delete(''operation'', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
