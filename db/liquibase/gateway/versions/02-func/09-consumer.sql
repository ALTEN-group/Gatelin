-- Create INSTEAD OF trigger function for consumers view
-- Handles INSERT and UPDATE on the consumers view,
-- mapping audit properties (creatorId/creatorName, updaterId/updaterName) to the underlying consumer table.
CREATE OR REPLACE FUNCTION iud_consumer() RETURNS trigger AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO consumer ("userId", nickname, "accessToken", "refreshToken", roles, "creatorId", "creatorName")
      VALUES (
        NEW."userId",
        NEW.nickname,
        NEW."accessToken",
        NEW."refreshToken",
        NEW.roles,
        NEW."creatorId",
        NEW."creatorName"
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE consumer
      SET
        nickname       = COALESCE(NEW.nickname,       nickname),
        "accessToken"  = COALESCE(NEW."accessToken",  "accessToken"),
        "refreshToken" = COALESCE(NEW."refreshToken", "refreshToken"),
        roles          = COALESCE(NEW.roles,          roles),
        "updaterId"    = NEW."updaterId",
        "updaterName"  = NEW."updaterName",
        "updatedAt"    = NOW()
      WHERE id = NEW.id;

      PERFORM set_archived('consumer', OLD.id, NEW.archived, OLD.archived);

      RETURN NEW;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
