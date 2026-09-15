-- Create INSTEAD OF trigger on conditions view
CREATE TRIGGER conditions_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "conditions"
FOR EACH ROW
EXECUTE PROCEDURE iud_condition();

-- Refuse archive of core catalog conditions (fires on set_archived and direct UPDATE)
CREATE TRIGGER condition_core_before_update_trigger
BEFORE UPDATE ON "condition"
FOR EACH ROW
EXECUTE PROCEDURE before_update_condition();

-- Apply history trigger to condition table
CREATE TRIGGER condition_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON "condition"
FOR EACH ROW
EXECUTE PROCEDURE iud_history();
