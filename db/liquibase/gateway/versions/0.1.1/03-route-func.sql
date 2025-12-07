
-- Create trigger function to insert, update, delete a role
CREATE OR REPLACE FUNCTION iud_route() RETURNS trigger AS '
  DECLARE
    _key   text;
    _value text;
    p   JSONB;
    a   JSONB;
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO "role" ("appId", name, description, color, level, "default")
      VALUES (
        NEW."appId",
        NEW.name,
        NEW.description,
        NEW.color,
        NEW.level,
        NEW.default
      )
      RETURNING id INTO NEW.id;

      IF NEW."permissionsJsonAgg" IS NOT NULL THEN
          FOR p IN SELECT * FROM jsonb_array_elements(NEW."permissionsJsonAgg") LOOP
            INSERT INTO permission ("roleId", "functionalityId", "operationId") 
            VALUES (NEW.id, CAST(p->>''functionality'' AS INT), CAST(p->>''operation'' AS INT));
            FOR a IN SELECT * FROM jsonb_array_elements(p->''attributes'') LOOP
              INSERT INTO role_attribute ("roleId", "attributeId") 
              VALUES (NEW.id, CAST(a AS INT));
            END LOOP;
          END LOOP;
        END IF;
      PERFORM log_history(TG_TABLE_SCHEMA, TG_RELNAME, TG_OP, row_to_json(NEW));
      RETURN NEW;
      
    ELSIF TG_OP = ''UPDATE'' THEN
      UPDATE "role" 
      SET 
        "appId" = COALESCE(NEW."appId", "appId"),
        name = COALESCE(NEW.name, name),
        description = COALESCE(NEW.description, description),
        color = COALESCE(NEW.color, color),
        level = COALESCE(NEW.level, level)
        -- "default" = COALESCE(NEW."default", "default")
      WHERE id = NEW.id;

      PERFORM soft_delete(''role'', NEW.id, NEW.archived, OLD.archived);

      IF NEW.archived IS TRUE THEN
        DELETE FROM user_role WHERE "roleId" = NEW.id;
      ELSE
        DELETE FROM permission 
        WHERE "roleId" = NEW.id;

        DELETE FROM role_attribute
        WHERE "roleId" = NEW.id;

        IF NEW."permissionsJsonAgg" IS NOT NULL THEN
          FOR p IN SELECT * FROM jsonb_array_elements(NEW."permissionsJsonAgg") LOOP
            INSERT INTO permission ("roleId", "functionalityId", "operationId") 
            VALUES (NEW.id, CAST(p->>''functionality'' AS INT), CAST(p->>''operation'' AS INT));
            FOR a IN SELECT * FROM jsonb_array_elements(p->''attributes'') LOOP
              INSERT INTO role_attribute ("roleId", "attributeId") 
              VALUES (NEW.id, CAST(a AS INT));
            END LOOP;
          END LOOP;
        END IF;
      END IF;
      PERFORM log_history(TG_TABLE_SCHEMA, TG_RELNAME, TG_OP, row_to_json(NEW));
      RETURN NEW;
    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
