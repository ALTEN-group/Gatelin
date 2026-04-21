-- BEFORE UPDATE trigger function for method table
-- Restricts updates to color and updater audit columns only
CREATE OR REPLACE FUNCTION before_update_method() RETURNS trigger AS '
  BEGIN
    NEW.name = OLD.name;
    RETURN NEW;
  END;
' LANGUAGE plpgsql SECURITY DEFINER;
