-- Create INSTEAD OF trigger on preferences view
CREATE TRIGGER preferences_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "preferences"
FOR EACH ROW
EXECUTE PROCEDURE iud_preference();

-- Limit trigger on preference table
CREATE TRIGGER trg_preference_limit
  BEFORE INSERT ON preference
  FOR EACH ROW EXECUTE FUNCTION check_preference_limit();
