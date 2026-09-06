-- Create INSTEAD OF trigger on resources view
CREATE TRIGGER resources_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "resources"
FOR EACH ROW 
EXECUTE PROCEDURE iud_resource();

-- Refuse archive of core catalog resources (fires on set_archived and direct UPDATE)
CREATE TRIGGER resource_before_update_trigger
BEFORE UPDATE ON "resource"
FOR EACH ROW
EXECUTE PROCEDURE before_update_resource();

-- Apply history trigger to resource table
CREATE TRIGGER resource_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "resource"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();
