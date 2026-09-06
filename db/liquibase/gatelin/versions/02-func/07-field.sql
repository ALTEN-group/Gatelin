-- Create INSTEAD OF trigger function for fields view
-- This function handles INSERT, UPDATE, DELETE operations on the fields view
-- by converting them to operations on the underlying field table
CREATE OR REPLACE FUNCTION iud_field() RETURNS trigger AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO field ("resourceId", name, core, "creatorId", "creatorName")
      VALUES (
        NEW."resourceId",
        NEW.name,
        COALESCE(NEW.core, FALSE),
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE field
      SET
        "resourceId" = COALESCE(NEW."resourceId", "resourceId"),
        name = COALESCE(NEW.name, name),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived('field', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Blocks archiving core catalog fields, including set_archived() and direct
-- UPDATE of the base table. Conditions reference fields with ON DELETE
-- RESTRICT, and permission fields arrays match these names. Also keeps core
-- immutable so it cannot be cleared in the same UPDATE.
CREATE OR REPLACE FUNCTION before_update_field() RETURNS trigger AS $$
  BEGIN
    IF NOT OLD.core THEN
      RETURN NEW;
    END IF;
    NEW.core = OLD.core;
    IF NEW.archived THEN
      RAISE EXCEPTION 'A core field (id=%) cannot be archived.', OLD.id;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;
