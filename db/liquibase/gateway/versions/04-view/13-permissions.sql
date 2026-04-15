-- Cache view used by the gateway role service at startup
CREATE OR REPLACE VIEW role_cache AS
  SELECT
    r.id,
    r.archived,
    COALESCE(
      jsonb_agg(
        jsonb_build_object('route', pp."routeId", 'operations', pp.ops, 'fields', pp.fields)
        ORDER BY pp."routeId"
      ) FILTER (WHERE pp."routeId" IS NOT NULL),
      '[]'::jsonb
    ) AS permissions
  FROM roles r
  LEFT JOIN (
    SELECT
      "roleId",
      "routeId",
      array_agg("operationId" ORDER BY "operationId") AS ops,
      (array_agg(fields ORDER BY "operationId") FILTER (WHERE fields IS NOT NULL))[1] AS fields
    FROM permission
    GROUP BY "roleId", "routeId"
  ) pp ON pp."roleId" = r.id
  GROUP BY r.id, r.archived;

-- INSTEAD OF trigger function for the permissions management view
CREATE OR REPLACE FUNCTION iud_permission() RETURNS trigger AS '
  BEGIN
    IF TG_OP = ''INSERT'' THEN
      INSERT INTO permission ("roleId", "routeId", "operationId", fields)
      VALUES (NEW."roleId", NEW."routeId", NEW."operationId", NEW.fields)
      RETURNING id INTO NEW.id;
      RETURN NEW;

    ELSIF TG_OP = ''UPDATE'' THEN
      IF NEW.archived = TRUE THEN
        DELETE FROM permission WHERE id = OLD.id;
        RETURN NEW;
      END IF;
      UPDATE permission
      SET
        "routeId"     = COALESCE(NEW."routeId", OLD."routeId"),
        "operationId" = COALESCE(NEW."operationId", OLD."operationId"),
        fields        = NEW.fields
      WHERE id = NEW.id;
      RETURN NEW;

    END IF;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;

-- Management view: joins route and operation names for display in the admin datagrid
CREATE OR REPLACE VIEW permissions AS
  SELECT
    p.id,
    p."roleId",
    p."routeId",
    rt.name AS "routeName",
    p."operationId",
    o.name  AS "operationName",
    p.fields,
    false::BOOLEAN    AS archived,
    NULL::TIMESTAMP   AS "archivedAt"
  FROM permission p
  LEFT JOIN route     rt ON rt.id = p."routeId"
  LEFT JOIN operation o  ON o.id  = p."operationId"
  ORDER BY p."roleId" ASC, p."routeId" ASC;

CREATE TRIGGER permissions_iud_trigger
INSTEAD OF INSERT OR UPDATE ON "permissions"
FOR EACH ROW
EXECUTE PROCEDURE iud_permission();
