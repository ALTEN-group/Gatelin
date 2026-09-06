-- Apply archived timestamp trigger to operation table
CREATE TRIGGER operation_archived_trigger
BEFORE UPDATE ON "operation"
FOR EACH ROW
EXECUTE PROCEDURE before_update_archived();

-- Refuse archive of core catalog operations (fires on archive and direct UPDATE)
CREATE TRIGGER operation_core_before_update_trigger
BEFORE UPDATE ON "operation"
FOR EACH ROW
EXECUTE PROCEDURE before_update_operation();

-- Apply history trigger to operation table
CREATE TRIGGER operation_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "operation"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();
