-- Create INSTEAD OF trigger on permissions view
CREATE TRIGGER permissions_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "permissions"
FOR EACH ROW
EXECUTE PROCEDURE iud_permission();

-- History trigger on the underlying permission table
CREATE TRIGGER permission_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON permission
FOR EACH ROW
EXECUTE PROCEDURE iud_history();
