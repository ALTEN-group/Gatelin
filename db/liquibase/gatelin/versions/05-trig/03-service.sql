-- Apply archived timestamp trigger to service table
CREATE TRIGGER service_archived_trigger
BEFORE UPDATE ON "service"
FOR EACH ROW
EXECUTE PROCEDURE before_update_archived();

-- Refuse archive of the core gatelin service (fires on archive and direct UPDATE)
CREATE TRIGGER service_core_before_update_trigger
BEFORE UPDATE ON "service"
FOR EACH ROW
EXECUTE PROCEDURE before_update_service();

-- Apply history trigger to service table
CREATE TRIGGER service_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "service"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();

