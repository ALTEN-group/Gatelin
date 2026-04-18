-- Apply history trigger to service table
CREATE TRIGGER service_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "service"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();
