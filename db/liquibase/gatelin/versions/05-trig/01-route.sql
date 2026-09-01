-- Create INSTEAD OF trigger on routes view
CREATE TRIGGER routes_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "routes"
FOR EACH ROW 
EXECUTE PROCEDURE iud_route();

-- Apply history trigger to route table
CREATE TRIGGER route_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "route"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();
