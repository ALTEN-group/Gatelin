BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM role_cache
    WHERE id = (SELECT id FROM role WHERE name = 'Gatelin super admin')
      AND locked
  ) THEN
    RAISE EXCEPTION 'role_cache dropped locked for Gatelin super admin';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM role_cache
    WHERE id = (SELECT id FROM role WHERE name = 'Gatelin admin')
      AND locked
  ) THEN
    RAISE EXCEPTION 'role_cache dropped locked for Gatelin admin';
  END IF;
END;
$$;

ROLLBACK;
