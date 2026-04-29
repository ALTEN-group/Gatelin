-- Create INSTEAD OF trigger function for fields view
-- This function handles INSERT, UPDATE, DELETE operations on the fields view
-- by converting them to operations on the underlying field table
CREATE OR REPLACE FUNCTION iud_field() RETURNS trigger AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO field ("resourceId", name, "creatorId", "creatorName")
      VALUES (
        NEW."resourceId",
        NEW.name,
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
