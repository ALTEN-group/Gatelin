-- Apply archived timestamp trigger to cors table
CREATE TRIGGER cors_archived_trigger
BEFORE UPDATE ON "cors"
FOR EACH ROW
EXECUTE PROCEDURE before_update_archived();

-- Apply history trigger to cors table
CREATE TRIGGER cors_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "cors"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();
