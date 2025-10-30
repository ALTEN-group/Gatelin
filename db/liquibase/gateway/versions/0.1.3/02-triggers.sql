
--
-- Apply history trigger to consumer table  
--
CREATE TRIGGER consumer_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "consumer"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();


--
-- Apply history trigger to route table
--
CREATE TRIGGER route_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "route"
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

