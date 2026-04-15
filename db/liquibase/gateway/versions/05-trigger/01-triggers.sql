
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

-- Create INSTEAD OF trigger on cors_list view
CREATE TRIGGER cors_list_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "cors_list"
FOR EACH ROW
EXECUTE PROCEDURE iud_cors();

-- Apply history trigger to cors table
CREATE TRIGGER cors_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "cors"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();

-- Create INSTEAD OF trigger on operations view
CREATE TRIGGER operations_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "operations"
FOR EACH ROW
EXECUTE PROCEDURE iud_operation();

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

-- Create INSTEAD OF trigger on preferences view
CREATE TRIGGER preferences_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "preferences"
FOR EACH ROW
EXECUTE PROCEDURE iud_preference();


-- INSTEAD OF trigger on roles view
CREATE TRIGGER roles_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "roles"
FOR EACH ROW
EXECUTE PROCEDURE iud_role();

-- History trigger on role table
CREATE TRIGGER role_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON "role"
FOR EACH ROW
EXECUTE PROCEDURE change_trigger();

-- INSTEAD OF trigger on consumers view
CREATE TRIGGER consumers_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "consumers"
FOR EACH ROW
EXECUTE PROCEDURE iud_consumer();

-- Limit trigger on preference table
CREATE TRIGGER trg_preference_limit
  BEFORE INSERT ON preference
  FOR EACH ROW EXECUTE FUNCTION check_preference_limit();

-- INSTEAD OF trigger on permissions view
CREATE TRIGGER permissions_iud_trigger
INSTEAD OF INSERT OR UPDATE ON "permissions"
FOR EACH ROW
EXECUTE PROCEDURE iud_permission();
