-- Apply history trigger to cors table
CREATE TRIGGER cors_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "cors"
FOR EACH ROW 
EXECUTE PROCEDURE change_trigger();
