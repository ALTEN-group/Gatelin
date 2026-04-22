--
-- Default application inserts
--

INSERT INTO application (name, description, "creatorId", "creatorName") VALUES
  ('Gatelin', 'Gatelin administration application', -1, 'system')
ON CONFLICT DO NOTHING;
