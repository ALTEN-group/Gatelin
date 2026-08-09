-- Create INSTEAD OF trigger function for roles view
-- This function handles INSERT, UPDATE, DELETE operations on the roles view
-- by converting them to operations on the underlying role table
CREATE OR REPLACE FUNCTION iud_role() RETURNS trigger AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO role ("appId", name, description, color, "creatorId", "creatorName")
      VALUES (
        NEW."appId",
        NEW.name,
        NEW.description,
        NEW.color,
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE role
      SET
        "appId" = COALESCE(NEW."appId", "appId"),
        name = COALESCE(NEW.name, name),
        description = COALESCE(NEW.description, description),
        color = COALESCE(NEW.color, color),
        "updaterId" = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt" = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived('role', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
