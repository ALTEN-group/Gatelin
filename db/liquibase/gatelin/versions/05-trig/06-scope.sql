-- Create INSTEAD OF trigger on scopes view
CREATE TRIGGER scopes_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "scopes"
FOR EACH ROW 
EXECUTE PROCEDURE iud_scope();

-- Refuse archive of core catalog scopes (fires on set_archived and direct UPDATE)
CREATE TRIGGER scope_core_before_update_trigger
BEFORE UPDATE ON "scope"
FOR EACH ROW
EXECUTE PROCEDURE before_update_scope();

-- Apply history trigger to scope table
CREATE TRIGGER scope_history_trigger 
AFTER INSERT OR UPDATE OR DELETE ON "scope"
FOR EACH ROW 
EXECUTE PROCEDURE iud_history();
