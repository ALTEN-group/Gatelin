-- Blocks archiving the core gatelin service, including set_archived() and
-- direct UPDATE of the base table. Resources CASCADE from service, so a
-- core archive would let retention wipe the catalog resources. Also keeps
-- core immutable so it cannot be cleared in the same UPDATE.
CREATE OR REPLACE FUNCTION before_update_service() RETURNS trigger AS $$
  BEGIN
    IF NOT OLD.core THEN
      RETURN NEW;
    END IF;
    NEW.core = OLD.core;
    IF NEW.archived THEN
      RAISE EXCEPTION 'A core service (id=%) cannot be archived.', OLD.id;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;
