-- Create INSTEAD OF trigger on routes view
CREATE TRIGGER routes_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "routes"
FOR EACH ROW 
EXECUTE PROCEDURE iud_route();

-- Refuse protected/pattern/archive changes on core system routes
CREATE TRIGGER route_before_update_trigger
BEFORE UPDATE ON route
FOR EACH ROW
EXECUTE PROCEDURE before_update_route();

-- Apply history trigger to route table
CREATE TRIGGER route_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "route"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();
