-- Apply archived timestamp trigger to application table
CREATE TRIGGER application_archived_trigger
BEFORE UPDATE ON "application"
FOR EACH ROW
EXECUTE PROCEDURE before_update_archived();

-- Refuse archive of the core Gatelin application (fires on archive and direct UPDATE)
CREATE TRIGGER application_before_update_trigger
BEFORE UPDATE ON "application"
FOR EACH ROW
EXECUTE PROCEDURE before_update_application();

-- Apply history trigger to application table
CREATE TRIGGER application_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "application"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();
