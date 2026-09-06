-- Create INSTEAD OF trigger on fields view
CREATE TRIGGER fields_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "fields"
FOR EACH ROW 
EXECUTE PROCEDURE iud_field();

-- Refuse archive of core catalog fields (fires on set_archived and direct UPDATE)
CREATE TRIGGER field_core_before_update_trigger
BEFORE UPDATE ON "field"
FOR EACH ROW
EXECUTE PROCEDURE before_update_field();

-- Apply history trigger to field table
CREATE TRIGGER field_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "field"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();
