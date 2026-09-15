-- Create INSTEAD OF trigger function for apis view
-- This function handles INSERT, UPDATE, DELETE operations on the resources view
-- by converting them to operations on the underlying resource table
CREATE OR REPLACE FUNCTION iud_resource() RETURNS trigger AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO resource ("serviceId", name, description, core, "creatorId", "creatorName")
      VALUES (
        NEW."serviceId",
        NEW.name,
        NEW.description,
        COALESCE(NEW.core, FALSE),
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE resource
      SET
        "serviceId" = COALESCE(NEW."serviceId", "serviceId"),
        name = COALESCE(NEW.name, name),
        description = COALESCE(NEW.description, description),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived('resource', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Blocks archiving core catalog resources (routes, permissions, …), including
-- set_archived() and direct UPDATE of the base table. Routes and fields
-- CASCADE from resource, so a core archive would let retention wipe system
-- routes. Also keeps core immutable so it cannot be cleared in the same UPDATE.
CREATE OR REPLACE FUNCTION before_update_resource() RETURNS trigger AS $$
  BEGIN
    IF NOT OLD.core THEN
      RETURN NEW;
    END IF;
    NEW.core = OLD.core;
    IF NEW.archived THEN
      RAISE EXCEPTION 'A core resource (id=%) cannot be archived.', OLD.id;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;
