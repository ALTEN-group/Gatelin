-- Create INSTEAD OF trigger on permissions view
CREATE TRIGGER permissions_iud_trigger
INSTEAD OF INSERT OR UPDATE ON "permissions"
FOR EACH ROW
EXECUTE PROCEDURE iud_permission();
