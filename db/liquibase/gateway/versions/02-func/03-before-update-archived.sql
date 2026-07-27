-- Generic BEFORE UPDATE trigger function to handle archivedAt timestamp
CREATE OR REPLACE FUNCTION before_update_archived() RETURNS trigger AS $$
BEGIN
  IF NEW.archived = TRUE AND OLD.archived = FALSE THEN
    NEW."archivedAt" = NOW();
  ELSIF NEW.archived = FALSE THEN
    NEW."archivedAt" = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
