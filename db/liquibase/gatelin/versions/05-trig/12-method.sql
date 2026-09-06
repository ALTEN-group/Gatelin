-- BEFORE UPDATE trigger on method: restricts updates to color only
CREATE TRIGGER method_before_update_trigger
BEFORE UPDATE ON method
FOR EACH ROW
EXECUTE PROCEDURE before_update_method();

-- History trigger on method table
CREATE TRIGGER method_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON method
FOR EACH ROW
EXECUTE PROCEDURE iud_history();
