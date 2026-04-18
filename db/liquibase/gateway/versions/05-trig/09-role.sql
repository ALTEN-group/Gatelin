-- History trigger on role table
CREATE TRIGGER role_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON "role"
FOR EACH ROW
EXECUTE PROCEDURE change_trigger();
