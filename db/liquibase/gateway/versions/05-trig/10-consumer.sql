-- Create INSTEAD OF trigger on consumers view
CREATE TRIGGER consumers_iud_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON "consumers"
FOR EACH ROW
EXECUTE PROCEDURE iud_consumer();
