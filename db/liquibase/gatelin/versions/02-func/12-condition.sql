-- Create INSTEAD OF trigger function for conditions view
-- This function handles INSERT, UPDATE, DELETE operations on the conditions view
-- by converting them to operations on the underlying condition table
CREATE OR REPLACE FUNCTION iud_condition() RETURNS trigger AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO condition (name, "fieldId", op, value, color, core, "creatorId", "creatorName")
      VALUES (
        NEW.name,
        NEW."fieldId",
        NEW.op,
        NEW.value,
        NEW.color,
        COALESCE(NEW.core, FALSE),
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE condition
      SET
        name = COALESCE(NEW.name, name),
        "fieldId" = COALESCE(NEW."fieldId", "fieldId"),
        op = COALESCE(NEW.op, op),
        value = COALESCE(NEW.value, value),
        color = NEW.color,
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived('condition', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Blocks archiving core catalog conditions, including set_archived() and
-- direct UPDATE of the base table. permission_condition CASCADE from
-- condition, so a core archive would let retention strip the seeded Admin
-- search filters. Also keeps core immutable so it cannot be cleared in the
-- same UPDATE.
CREATE OR REPLACE FUNCTION before_update_condition() RETURNS trigger AS $$
  BEGIN
    IF NOT OLD.core THEN
      RETURN NEW;
    END IF;
    NEW.core = OLD.core;
    IF NEW.archived THEN
      RAISE EXCEPTION 'A core condition (id=%) cannot be archived.', OLD.id;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;
