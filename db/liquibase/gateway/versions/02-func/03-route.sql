
-- Create INSTEAD OF trigger function for routes view
-- This function handles INSERT, UPDATE, DELETE operations on the routes view
-- by converting them to operations on the underlying route table
CREATE OR REPLACE FUNCTION iud_route() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO route ("resourceId", name, description, pattern, protected, locked, "creatorId", "creatorName")
      VALUES (
        NEW."resourceId",
        NEW.name,
        NEW.description,
        NEW.pattern,
        NEW.protected,
        NEW.locked,
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;

      IF NEW.operations IS NOT NULL THEN
        INSERT INTO route_operation ("routeId", "operationId")
        SELECT NEW.id, o
        FROM unnest(NEW.operations) AS o;
      END IF;

      IF NEW."methodIds" IS NOT NULL THEN
        INSERT INTO route_method ("routeId", "methodId")
        SELECT NEW.id, m
        FROM unnest(NEW."methodIds") AS m;
      END IF;

      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE route
      SET
        "resourceId" = COALESCE(NEW."resourceId", "resourceId"),
        name = COALESCE(NEW.name, name),
        description = COALESCE(NEW.description, description),
        pattern = COALESCE(NEW.pattern, pattern),
        protected = COALESCE(NEW.protected, protected),
        locked = COALESCE(NEW.locked, locked),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      IF NEW.operations IS NOT NULL THEN
        DELETE FROM route_operation WHERE "routeId" = NEW.id;
        INSERT INTO route_operation ("routeId", "operationId")
        SELECT NEW.id, o
        FROM unnest(NEW.operations) AS o;
      END IF;

      IF NEW."methodIds" IS NOT NULL THEN
        DELETE FROM route_method WHERE "routeId" = NEW.id;
        INSERT INTO route_method ("routeId", "methodId")
        SELECT NEW.id, m
        FROM unnest(NEW."methodIds") AS m;
      END IF;

      PERFORM set_archived(''route'', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
