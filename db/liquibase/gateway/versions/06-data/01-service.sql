--
-- service default inserts
--

INSERT INTO "service" ("appId", name, pattern, core, "creatorId", "creatorName")
SELECT a.id, v.name, v.pattern, v.core, -1, 'system'
FROM application a,
(VALUES
  ('gatelin',      'gateway', true),
  ('ms-user-mock', 'users',      false)
) AS v(name, pattern, core)
WHERE a.name = 'Gatelin'
ON CONFLICT DO NOTHING;
