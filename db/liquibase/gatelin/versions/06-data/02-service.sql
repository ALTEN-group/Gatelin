--
-- service default inserts
--

INSERT INTO service (name, pattern, core, "creatorId", "creatorName") VALUES
  ('gatelin',      'gatelin', true,  -1, 'system'),
  ('ms-user-mock', 'users',   false, -1, 'system')
ON CONFLICT DO NOTHING;
