--
-- service default inserts
--

INSERT INTO "service" ("appId", name, pattern, locked, "creatorId", "creatorName")
SELECT a.id, v.name, v.pattern, v.locked, -1, 'system'
FROM application a,
(VALUES
  ('gatelin',      'gateway', true),
  ('ms-user-mock', null,      false)
) AS v(name, pattern, locked)
WHERE a.name = 'Gatelin'
ON CONFLICT DO NOTHING;
