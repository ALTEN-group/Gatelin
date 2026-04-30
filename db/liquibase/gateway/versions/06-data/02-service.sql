--
-- service default inserts
--

INSERT INTO "service" ("appId", name, pattern, core, "creatorId", "creatorName") VALUES
  (1, 'gatelin',      'gateway', true,  -1, 'system'),
  (1, 'ms-user-mock', 'users',   false, -1, 'system')
ON CONFLICT DO NOTHING;
