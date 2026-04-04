
-- Create INSTEAD OF trigger on routes view
CREATE TRIGGER routes_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "routes"
FOR EACH ROW 
EXECUTE PROCEDURE iud_route();

-- Apply history trigger to route table
CREATE TRIGGER route_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "route"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

-- Create INSTEAD OF trigger on resources view
CREATE TRIGGER resources_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "resources"
FOR EACH ROW 
EXECUTE PROCEDURE iud_resource();

-- Apply history trigger to resource table
CREATE TRIGGER resource_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "resource"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

-- Apply history trigger to service table
CREATE TRIGGER service_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "service"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

-- Apply history trigger to cors table
CREATE TRIGGER cors_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "cors"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

-- Apply history trigger to operation table
CREATE TRIGGER operation_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "operation"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

-- Create INSTEAD OF trigger on scopes view
CREATE TRIGGER scopes_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "scopes"
FOR EACH ROW 
EXECUTE PROCEDURE iud_scope();

-- Apply history trigger to scope table
CREATE TRIGGER scope_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "scope"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

-- Create INSTEAD OF trigger on fields view
CREATE TRIGGER fields_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "fields"
FOR EACH ROW 
EXECUTE PROCEDURE iud_field();

-- Apply history trigger to field table
CREATE TRIGGER field_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "field"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

