-- Create INSTEAD OF trigger on services view
CREATE TRIGGER services_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "services"
FOR EACH ROW
EXECUTE PROCEDURE iud_service();

-- Apply history trigger to service table
CREATE TRIGGER service_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "service"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

