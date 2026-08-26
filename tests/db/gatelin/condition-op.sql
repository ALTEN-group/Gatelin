BEGIN;

DO $$
DECLARE
  field_id integer;
  cond_id integer;
BEGIN
  SELECT id INTO STRICT field_id FROM field WHERE name = 'archived' LIMIT 1;

  INSERT INTO conditions (
    name,
    "fieldId",
    op,
    value,
    "creatorId",
    "creatorName"
  )
  VALUES (
    'db-condition-eq',
    field_id,
    '=',
    'false',
    9001,
    'db-test'
  )
  RETURNING id INTO cond_id;

  IF NOT EXISTS (
    SELECT 1
    FROM condition
    WHERE id = cond_id
      AND op = '='
      AND name = 'db-condition-eq'
  ) THEN
    RAISE EXCEPTION 'valid condition op was not written to the base table';
  END IF;

  BEGIN
    INSERT INTO conditions (
      name,
      "fieldId",
      op,
      value,
      "creatorId",
      "creatorName"
    )
    VALUES (
      'db-condition-bad-op',
      field_id,
      'LIKE',
      'false',
      9001,
      'db-test'
    );
    RAISE EXCEPTION 'invalid condition op was accepted';
  EXCEPTION
    WHEN check_violation THEN
      NULL;
  END;
END;
$$;

ROLLBACK;
