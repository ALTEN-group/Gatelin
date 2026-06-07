--
-- eBoutique test applications
--

INSERT INTO application (name, description, "creatorId", "creatorName") VALUES
  ('eBoutique',    'eBoutique web & mobile app',    -1, 'system'),
  ('eBoutique Admin',  'eBoutique admin app', -1, 'system')
ON CONFLICT DO NOTHING;

