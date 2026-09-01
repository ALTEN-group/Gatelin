-- Create INSTEAD OF trigger on resources view
CREATE TRIGGER resources_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "resources"
FOR EACH ROW 
EXECUTE PROCEDURE iud_resource();

-- Apply history trigger to resource table
CREATE TRIGGER resource_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "resource"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();
