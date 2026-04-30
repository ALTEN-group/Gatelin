-- Scope seed data
-- Each scope name matches a resource name and is linked to the getPreferences route
-- The scope value is matched against the URL segment immediately after the resource name in checkAcl

INSERT INTO scopes ("routeId", name, archived, "creatorId", "creatorName")
SELECT r.id, v.name, false, -1, 'system'
FROM route r
CROSS JOIN (VALUES
  ('session'),
  ('consumers'),
  ('routes'),
  ('services'),
  ('resources'),
  ('operations'),
  ('cors'),
  ('fields'),
  ('scopes'),
  ('preferences'),
  ('users'),
  ('roles')
) AS v(name)
WHERE r.name = 'getPreferences'
;
