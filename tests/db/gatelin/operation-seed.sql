BEGIN;

CREATE TEMP TABLE operation_seed_test_state (
  count_before integer NOT NULL
) ON COMMIT DROP;

INSERT INTO operation_seed_test_state
SELECT count(*) FROM operation;

\i /schema/versions/06-data/03-operation.sql

DO $$
DECLARE
  duplicate_names integer;
BEGIN
  IF (SELECT count_before FROM operation_seed_test_state) = 0 THEN
    RAISE EXCEPTION 'operation seed did not create any rows';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM operation
    WHERE name = 'read'
      AND "creatorId" = -1
      AND "creatorName" = 'system'
  ) THEN
    RAISE EXCEPTION 'required read operation seed is missing';
  END IF;

  IF (SELECT count(*) FROM operation)
      <> (SELECT count_before FROM operation_seed_test_state) THEN
    RAISE EXCEPTION 'reapplying the operation seed inserted duplicate rows';
  END IF;

  SELECT count(*)
  INTO duplicate_names
  FROM (
    SELECT name
    FROM operation
    GROUP BY name
    HAVING count(*) > 1
  ) duplicates;

  IF duplicate_names <> 0 THEN
    RAISE EXCEPTION 'operation seed contains duplicate names';
  END IF;
END;
$$;

ROLLBACK;
