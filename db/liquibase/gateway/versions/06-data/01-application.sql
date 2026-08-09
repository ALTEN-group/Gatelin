--
-- Default application inserts
--

INSERT INTO application (name, description, core, "creatorId", "creatorName") VALUES
  ('Gatelin', 'Gatelin administration application', true, -1, 'system')
ON CONFLICT DO NOTHING;
