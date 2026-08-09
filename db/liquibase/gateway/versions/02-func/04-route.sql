
-- Create INSTEAD OF trigger function for routes view
-- This function handles INSERT, UPDATE, DELETE operations on the routes view
-- by converting them to operations on the underlying route table
CREATE OR REPLACE FUNCTION iud_route() RETURNS trigger AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO route ("resourceId", name, description, pattern, protected, core, "creatorId", "creatorName")
      VALUES (
        NEW."resourceId",
        NEW.name,
        NEW.description,
        NEW.pattern,
        NEW.protected,
        COALESCE(NEW.core, FALSE),
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;

      IF NEW."operationId" IS NOT NULL THEN
        INSERT INTO route_operation ("routeId", "operationId")
        SELECT NEW.id, o
        FROM unnest(NEW."operationId") AS o;

        PERFORM log_history('public', 'route_operation', 'INSERT',
          jsonb_build_object('id', NEW.id, 'operationId', NEW."operationId",
                              'creatorId', NEW."creatorId", 'creatorName', NEW."creatorName")::json);
      END IF;

      IF NEW."methodIds" IS NOT NULL THEN
        INSERT INTO route_method ("routeId", "methodId")
        SELECT NEW.id, m
        FROM unnest(NEW."methodIds") AS m;

        PERFORM log_history('public', 'route_method', 'INSERT',
          jsonb_build_object('id', NEW.id, 'methodIds', NEW."methodIds",
                              'creatorId', NEW."creatorId", 'creatorName', NEW."creatorName")::json);
      END IF;

      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE route
      SET
        "resourceId" = COALESCE(NEW."resourceId", "resourceId"),
        name = COALESCE(NEW.name, name),
        description = COALESCE(NEW.description, description),
        pattern = COALESCE(NEW.pattern, pattern),
        protected = COALESCE(NEW.protected, protected),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      IF NEW."operationId" IS NOT NULL THEN
        DELETE FROM route_operation WHERE "routeId" = NEW.id;
        INSERT INTO route_operation ("routeId", "operationId")
        SELECT NEW.id, o
        FROM unnest(NEW."operationId") AS o;

        PERFORM log_history('public', 'route_operation', 'UPDATE',
          jsonb_build_object('id', NEW.id, 'operationId', NEW."operationId",
                              'updaterId', NEW."updaterId", 'updaterName', NEW."updaterName")::json);
      END IF;

      IF NEW."methodIds" IS NOT NULL THEN
        DELETE FROM route_method WHERE "routeId" = NEW.id;
        INSERT INTO route_method ("routeId", "methodId")
        SELECT NEW.id, m
        FROM unnest(NEW."methodIds") AS m;

        PERFORM log_history('public', 'route_method', 'UPDATE',
          jsonb_build_object('id', NEW.id, 'methodIds', NEW."methodIds",
                              'updaterId', NEW."updaterId", 'updaterName', NEW."updaterName")::json);
      END IF;

      PERFORM set_archived('route', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
