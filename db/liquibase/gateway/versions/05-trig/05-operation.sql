-- Apply archived timestamp trigger to operation table
CREATE TRIGGER operation_archived_trigger
BEFORE UPDATE ON "operation"
FOR EACH ROW
EXECUTE PROCEDURE before_update_archived();

-- Apply history trigger to operation table
CREATE TRIGGER operation_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "operation"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();
