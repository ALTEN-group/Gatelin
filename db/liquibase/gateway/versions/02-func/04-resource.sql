-- Create INSTEAD OF trigger function for apis view
-- This function handles INSERT, UPDATE, DELETE operations on the resources view
-- by converting them to operations on the underlying resource table
CREATE OR REPLACE FUNCTION iud_resource() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO resource ("serviceId", name, locked, "creatorId", "creatorName")
      VALUES (
        NEW."serviceId",
        NEW.name,
        NEW.locked,
        NEW."consumerId",
        NEW."consumerName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE resource
      SET
        "serviceId" = COALESCE(NEW."serviceId", "serviceId"),
        name = COALESCE(NEW.name, name),
        locked = COALESCE(NEW.locked, locked),
        "updaterId" = NEW."consumerId",
        "updaterName" = NEW."consumerName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived(''resource'', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
