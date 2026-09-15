
--
-- create trigger function to save history on changes
--
-- Attached only as AFTER ... FOR EACH ROW, so the returned row is discarded.
-- NEW is NULL on DELETE and OLD is NULL on INSERT, so one call covers all three
-- operations. Hard-delete runs from the archive job; log_history stamps system.
CREATE OR REPLACE FUNCTION iud_history() RETURNS trigger AS $$
BEGIN
  PERFORM public.log_history(
    TG_TABLE_SCHEMA,
    TG_RELNAME,
    TG_OP,
    row_to_json(COALESCE(NEW, OLD))
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO pg_catalog, public;
