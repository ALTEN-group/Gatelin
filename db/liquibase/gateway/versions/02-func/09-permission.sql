-- INSTEAD OF trigger function for the permissions management view
CREATE OR REPLACE FUNCTION iud_permission() RETURNS trigger AS $$
  DECLARE
    perm_id INT;
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO permission ("roleId", "routeId", "operationId", fields, scopes, "creatorId", "creatorName")
      VALUES (NEW."roleId", NEW."routeId", NEW."operationId", NEW.fields::text[], NEW.scopes::text[], NEW."creatorId", NEW."creatorName")
      RETURNING id INTO perm_id;
      IF NEW."conditionId" IS NOT NULL THEN
        INSERT INTO permission_condition ("permissionId", "conditionId")
        SELECT perm_id, cond_id FROM unnest(NEW."conditionId") AS cond_id
        WHERE cond_id IS NOT NULL;
      END IF;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
      SELECT id INTO perm_id FROM permission
      WHERE "roleId" = OLD."roleId" AND "routeId" = OLD."routeId" AND "operationId" = OLD."operationId";
      UPDATE permission SET
        "operationId" = NEW."operationId",
        fields        = NEW.fields::text[],
        scopes        = NEW.scopes::text[],
        "updaterId"   = NEW."updaterId",
        "updaterName" = NEW."updaterName",
        "updatedAt"   = NOW()
      WHERE id = perm_id;
      DELETE FROM permission_condition WHERE "permissionId" = perm_id;
      IF NEW."conditionId" IS NOT NULL THEN
        INSERT INTO permission_condition ("permissionId", "conditionId")
        SELECT perm_id, cond_id FROM unnest(NEW."conditionId") AS cond_id
        WHERE cond_id IS NOT NULL;
      END IF;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
      DELETE FROM permission
      WHERE "roleId" = OLD."roleId" AND "routeId" = OLD."routeId" AND "operationId" = OLD."operationId";
      RETURN OLD;

    END IF;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
