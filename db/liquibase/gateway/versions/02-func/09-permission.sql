-- INSTEAD OF trigger function for the permissions management view
CREATE OR REPLACE FUNCTION iud_permission() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO permission ("roleId", "routeId", "operationId", fields, scopes)
      SELECT NEW."roleId", NEW."routeId", op_id, NEW.fields::text[], NEW.scopes::text[]
      FROM unnest(NEW."operationId") AS op_id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      -- Replace all operations for this (roleId, routeId) pair
      DELETE FROM permission
      WHERE "roleId" = OLD."roleId" AND "routeId" = OLD."routeId";
      INSERT INTO permission ("roleId", "routeId", "operationId", fields, scopes)
      SELECT NEW."roleId", NEW."routeId", op_id, NEW.fields::text[], NEW.scopes::text[]
      FROM unnest(NEW."operationId") AS op_id;
      RETURN NEW;

    ELSIF TG_OP = ''DELETE'' THEN
      DELETE FROM permission
      WHERE "roleId" = OLD."roleId" AND "routeId" = OLD."routeId";
      RETURN OLD;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
