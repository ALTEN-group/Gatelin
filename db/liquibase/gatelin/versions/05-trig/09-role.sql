-- Create INSTEAD OF trigger on roles view
CREATE TRIGGER roles_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "roles"
FOR EACH ROW
EXECUTE PROCEDURE iud_role();

-- History trigger on role table
CREATE TRIGGER role_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON "role"
FOR EACH ROW
EXECUTE PROCEDURE iud_history();
