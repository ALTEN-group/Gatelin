-- Limit function for preference table: prevents a user from exceeding 10 preferences per resource
CREATE OR REPLACE FUNCTION check_preference_limit() RETURNS trigger AS $$
  DECLARE
    pref_count INT;
  BEGIN
    SELECT COUNT(*) INTO pref_count
    FROM preference
    WHERE "userId" = NEW."userId" AND "resourceId" = NEW."resourceId";

    IF pref_count >= 10 THEN
      RAISE EXCEPTION 'Preference limit reached: a user cannot have more than 10 preferences per table.';
    END IF;

    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- INSTEAD OF trigger function for the preferences view
-- This function handles INSERT, UPDATE, DELETE operations on the preferences view
-- by converting them to operations on the underlying preference table
CREATE OR REPLACE FUNCTION iud_preference() RETURNS trigger AS $$
  DECLARE
    updated_name TEXT;
    updated_conf JSONB;
    fork_name    TEXT;
    fork_n       INT;
    fork_id      INT;
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO preference ("userId", "resourceId", name, conf, "creatorId", "creatorName")
      VALUES (NEW."userId", NEW."resourceId", NEW.name, NEW.conf, NEW."creatorId", NEW."creatorName")
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE preference SET
        name          = COALESCE(NEW.name, name),
        conf          = COALESCE(NEW.conf, conf),
        "updaterId"   = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt"   = NOW()
      WHERE id = OLD.id
      RETURNING name, conf INTO updated_name, updated_conf;

      -- isActive=true selects this preference for the acting user (NEW."updaterId") on this resource.
      -- Templates (userId IS NULL) can't be selected directly: fork an identical personal copy first,
      -- then point the selection at the fork instead of the shared template.
      IF NEW."isActive" IS TRUE THEN
        IF OLD."userId" IS NULL THEN
          fork_name := updated_name || ' (copy)';
          fork_n := 1;
          WHILE EXISTS (
            SELECT 1 FROM preference
            WHERE "userId" = NEW."updaterId" AND "resourceId" = OLD."resourceId" AND name = fork_name
          ) LOOP
            fork_n := fork_n + 1;
            fork_name := updated_name || ' (copy ' || fork_n || ')';
          END LOOP;

          INSERT INTO preference ("userId", "resourceId", name, conf, "creatorId", "creatorName")
          VALUES (NEW."updaterId", OLD."resourceId", fork_name, updated_conf, NEW."updaterId", NEW."updaterName")
          RETURNING id INTO fork_id;

          INSERT INTO preference_selection ("userId", "resourceId", "preferenceId")
          VALUES (NEW."updaterId", OLD."resourceId", fork_id)
          ON CONFLICT ("userId", "resourceId")
          DO UPDATE SET "preferenceId" = EXCLUDED."preferenceId";
        ELSE
          INSERT INTO preference_selection ("userId", "resourceId", "preferenceId")
          VALUES (NEW."updaterId", NEW."resourceId", OLD.id)
          ON CONFLICT ("userId", "resourceId")
          DO UPDATE SET "preferenceId" = EXCLUDED."preferenceId";
        END IF;
      END IF;

      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
      DELETE FROM preference WHERE id = OLD.id;
      RETURN OLD;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Prevents deleting a template preference ("userId" IS NULL), regardless of whether the
-- delete comes through the preferences view or directly on the preference table
CREATE OR REPLACE FUNCTION check_preference_template_delete() RETURNS trigger AS $$
  BEGIN
    IF OLD."userId" IS NULL THEN
      RAISE EXCEPTION 'A template preference (id=%) cannot be deleted.', OLD.id;
    END IF;

    RETURN OLD;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Prevents a user's own preference from reusing a template's name for the same resource
CREATE OR REPLACE FUNCTION check_preference_template_name() RETURNS trigger AS $$
  BEGIN
    IF NEW."userId" IS NOT NULL AND EXISTS (
      SELECT 1 FROM preference
      WHERE "userId" IS NULL AND "resourceId" = NEW."resourceId" AND name = NEW.name
    ) THEN
      RAISE EXCEPTION 'A preference cannot use the same name (%) as a template for resource %.', NEW.name, NEW."resourceId";
    END IF;

    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
