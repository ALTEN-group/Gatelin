-- INSTEAD OF trigger function for the permissions management view
CREATE OR REPLACE FUNCTION iud_permission() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO permission ("roleId", "routeId", "operationId", fields)
      SELECT NEW."roleId", NEW."routeId", op_id, NEW.fields::text[]
      FROM unnest(NEW."operationId") AS op_id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      IF NEW.archived = TRUE THEN
        DELETE FROM permission
        WHERE "roleId" = OLD."roleId" AND "routeId" = OLD."routeId";
        RETURN NEW;
      END IF;
      -- Replace all operations for this (roleId, routeId) pair
      DELETE FROM permission
      WHERE "roleId" = OLD."roleId" AND "routeId" = OLD."routeId";
      INSERT INTO permission ("roleId", "routeId", "operationId", fields)
      SELECT
        COALESCE(NEW."roleId",  OLD."roleId"),
        COALESCE(NEW."routeId", OLD."routeId"),
        op_id,
        NEW.fields::text[]
      FROM unnest(NEW."operationId") AS op_id;
      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
