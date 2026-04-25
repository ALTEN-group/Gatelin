-- Limit trigger on preference table
CREATE TRIGGER trg_preference_limit
  BEFORE INSERT ON preference
  FOR EACH ROW EXECUTE FUNCTION check_preference_limit();

-- Apply history trigger to preference table
CREATE TRIGGER preference_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON "preference"
FOR EACH ROW
EXECUTE PROCEDURE change_trigger();
