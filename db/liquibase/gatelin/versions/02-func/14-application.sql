-- Blocks archiving the core Gatelin application, including set_archived()
-- and direct UPDATE of the base table. Locked system roles CASCADE from
-- application, so a core archive would let retention wipe Super-admin.
-- Also keeps core immutable so it cannot be cleared in the same UPDATE.
CREATE OR REPLACE FUNCTION before_update_application() RETURNS trigger AS $$
  BEGIN
    IF NOT OLD.core THEN
      RETURN NEW;
    END IF;
    NEW.core = OLD.core;
    IF NEW.archived THEN
      RAISE EXCEPTION 'A core application (id=%) cannot be archived.', OLD.id;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;
