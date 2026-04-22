--
-- eBoutique test applications
--

INSERT INTO application (name, description, "creatorId", "creatorName") VALUES
  ('eBoutique Web',    'eBoutique web application',    -1, 'system'),
  ('eBoutique Mobile', 'eBoutique mobile application', -1, 'system')
ON CONFLICT DO NOTHING;
