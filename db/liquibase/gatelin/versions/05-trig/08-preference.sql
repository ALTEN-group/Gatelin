-- Limit trigger on preference table
CREATE TRIGGER trg_preference_limit
  BEFORE INSERT ON preference
  FOR EACH ROW EXECUTE FUNCTION check_preference_limit();

-- Prevents a user's preference from reusing a template's name (same resource)
CREATE TRIGGER trg_preference_template_name
  BEFORE INSERT OR UPDATE ON preference
  FOR EACH ROW EXECUTE FUNCTION check_preference_template_name();

-- Prevents deleting a template preference
CREATE TRIGGER trg_preference_template_delete
  BEFORE DELETE ON preference
  FOR EACH ROW EXECUTE FUNCTION check_preference_template_delete();

-- Create INSTEAD OF trigger on preferences view
CREATE TRIGGER preferences_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "preferences"
FOR EACH ROW
EXECUTE PROCEDURE iud_preference();

-- -- Apply history trigger to preference table
-- CREATE TRIGGER preference_history_trigger
-- AFTER INSERT OR UPDATE OR DELETE ON "preference"
-- FOR EACH ROW
-- EXECUTE PROCEDURE iud_history();
