-- Create INSTEAD OF trigger function for scopes view
-- This function handles INSERT, UPDATE, DELETE operations on the scopes view
-- by converting them to operations on the underlying scope table
CREATE OR REPLACE FUNCTION iud_scope() RETURNS trigger AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO scope ("routeId", name, core, "creatorId", "creatorName")
      VALUES (
        NEW."routeId",
        NEW.name,
        COALESCE(NEW.core, FALSE),
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE scope
      SET
        "routeId" = COALESCE(NEW."routeId", "routeId"),
        name = COALESCE(NEW.name, name),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived('scope', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Blocks archiving core catalog scopes, including set_archived() and direct
-- UPDATE of the base table. Preference ACL matches these names against the
-- URL segment after the resource. Also keeps core immutable so it cannot be
-- cleared in the same UPDATE.
CREATE OR REPLACE FUNCTION before_update_scope() RETURNS trigger AS $$
  BEGIN
    IF NOT OLD.core THEN
      RETURN NEW;
    END IF;
    NEW.core = OLD.core;
    IF NEW.archived THEN
      RAISE EXCEPTION 'A core scope (id=%) cannot be archived.', OLD.id;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;
