-- Apply archived timestamp trigger to application table
CREATE TRIGGER application_archived_trigger
BEFORE UPDATE ON "application"
FOR EACH ROW
EXECUTE PROCEDURE before_update_archived();

-- Apply history trigger to application table
CREATE TRIGGER application_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "application"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();
