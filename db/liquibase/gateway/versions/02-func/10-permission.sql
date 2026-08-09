-- INSTEAD OF trigger function for the permissions management view
CREATE OR REPLACE FUNCTION iud_permission() RETURNS trigger AS $$
  DECLARE
    ins_id INT;
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO permission ("roleId", "routeId", "operationId", active, fields, scopes, "creatorId", "creatorName")
      VALUES (NEW."roleId", NEW."routeId", NEW."operationId", TRUE, NEW.fields::text[], NEW.scopes::text[], NEW."creatorId", NEW."creatorName")
      RETURNING id INTO ins_id;
      IF NEW."conditionId" IS NOT NULL THEN
        INSERT INTO permission_condition ("permissionId", "conditionId")
        SELECT ins_id, cond_id FROM unnest(NEW."conditionId") AS cond_id
        WHERE cond_id IS NOT NULL;

        PERFORM log_history('public', 'permission_condition', 'INSERT',
          jsonb_build_object('id', ins_id, 'routeId', NEW."routeId", 'conditionId', NEW."conditionId",
                              'creatorId', NEW."creatorId", 'creatorName', NEW."creatorName")::json);
      END IF;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE permission SET
        "operationId" = NEW."operationId",
        active        = NEW.active,
        fields        = NEW.fields::text[],
        scopes        = NEW.scopes::text[],
        "updaterId"   = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt"   = NOW()
      WHERE id = OLD.id;
      DELETE FROM permission_condition WHERE "permissionId" = OLD.id;
      IF NEW."conditionId" IS NOT NULL THEN
        INSERT INTO permission_condition ("permissionId", "conditionId")
        SELECT OLD.id, cond_id FROM unnest(NEW."conditionId") AS cond_id
        WHERE cond_id IS NOT NULL;

        PERFORM log_history('public', 'permission_condition', 'UPDATE',
          jsonb_build_object('id', OLD.id, 'routeId', OLD."routeId", 'conditionId', NEW."conditionId",
                              'updaterId', NEW."updaterId", 'updaterName', NEW."updaterName")::json);
      END IF;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
      DELETE FROM permission WHERE id = OLD.id;
      RETURN OLD;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
