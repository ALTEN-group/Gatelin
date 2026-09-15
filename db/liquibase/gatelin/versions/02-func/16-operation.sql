-- Blocks archiving core catalog operations, including set_archived() and
-- direct UPDATE of the base table. Permissions and route_operation CASCADE
-- from operation, so a core archive would let retention wipe system grants.
-- Also keeps core immutable so it cannot be cleared in the same UPDATE.
CREATE OR REPLACE FUNCTION before_update_operation() RETURNS trigger AS $$
  BEGIN
    IF NOT OLD.core THEN
      RETURN NEW;
    END IF;
    NEW.core = OLD.core;
    IF NEW.archived THEN
      RAISE EXCEPTION 'A core operation (id=%) cannot be archived.', OLD.id;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;
