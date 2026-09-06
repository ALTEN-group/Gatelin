-- Create INSTEAD OF trigger on roles view
CREATE TRIGGER roles_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "roles"
FOR EACH ROW
EXECUTE PROCEDURE iud_role();

-- Refuse archive of locked system roles (fires on set_archived and direct UPDATE)
CREATE TRIGGER role_before_update_trigger
BEFORE UPDATE ON role
FOR EACH ROW
EXECUTE PROCEDURE before_update_role();

-- History trigger on role table
CREATE TRIGGER role_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON "role"
FOR EACH ROW
EXECUTE PROCEDURE iud_history();
