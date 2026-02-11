
--
-- Create INSTEAD OF trigger on routes view
--
CREATE TRIGGER routes_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON routes
FOR EACH ROW 
EXECUTE PROCEDURE iud_route();

--
-- Apply history trigger to route table
--
CREATE TRIGGER route_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "route"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

--
-- Create INSTEAD OF trigger on resources view
--
CREATE TRIGGER resources_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON resources
FOR EACH ROW 
EXECUTE PROCEDURE iud_resource();

--
-- Apply history trigger to resource table
--
CREATE TRIGGER resource_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "resource"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

--
-- Apply history trigger to service table
--
CREATE TRIGGER service_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "service"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();


--
-- Apply history trigger to cors table
--
CREATE TRIGGER cors_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "cors"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

--
-- Apply history trigger to operation table
--
CREATE TRIGGER operation_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "operation"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();


