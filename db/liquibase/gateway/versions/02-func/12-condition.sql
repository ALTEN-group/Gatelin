-- Create INSTEAD OF trigger function for conditions view
-- This function handles INSERT, UPDATE, DELETE operations on the conditions view
-- by converting them to operations on the underlying condition table
CREATE OR REPLACE FUNCTION iud_condition() RETURNS trigger AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO condition (name, "fieldId", op, value, "creatorId", "creatorName")
      VALUES (
        NEW.name,
        NEW."fieldId",
        NEW.op,
        NEW.value,
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
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived('condition', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
