-- Create INSTEAD OF trigger function for consumers view
-- Handles INSERT and UPDATE on the consumers view,
-- mapping consumerId/consumerName (injected by antity-pgsql) to the underlying consumer table.
CREATE OR REPLACE FUNCTION iud_consumer() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO consumer ("userId", nickname, "accessToken", "refreshToken", roles)
      VALUES (
        NEW."userId",
        NEW.nickname,
        NEW."accessToken",
        NEW."refreshToken",
        NEW.roles
      )
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE consumer
      SET
        nickname     = COALESCE(NEW.nickname,     nickname),
        "accessToken" = COALESCE(NEW."accessToken", "accessToken"),
        "refreshToken" = COALESCE(NEW."refreshToken", "refreshToken"),
        roles        = COALESCE(NEW.roles,        roles),
        "updatedAt"  = NOW()
      WHERE id = NEW.id;

      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
