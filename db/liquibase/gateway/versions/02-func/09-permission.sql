-- INSTEAD OF trigger function for the permissions management view
CREATE OR REPLACE FUNCTION iud_permission() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO permission ("roleId", "routeId", "operationId", fields)
      VALUES (NEW."roleId", NEW."routeId", NEW."operationId", NEW.fields)
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      IF NEW.archived = TRUE THEN
        DELETE FROM permission WHERE id = OLD.id;
        RETURN NEW;
      END IF;
      UPDATE permission
      SET
        "routeId"     = COALESCE(NEW."routeId", OLD."routeId"),
        "operationId" = COALESCE(NEW."operationId", OLD."operationId"),
        fields        = NEW.fields
      WHERE id = NEW.id;
      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
