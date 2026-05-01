-- Scope seed data
-- Each scope name matches a resource name and is linked to the getPreferences route
-- The scope value is matched against the URL segment immediately after the resource name in checkAcl

INSERT INTO scopes ("routeId", name, archived, "creatorId", "creatorName") VALUES
  (63, 'session',     false, -1, 'system'),
  (63, 'consumers',   false, -1, 'system'),
  (63, 'routes',      false, -1, 'system'),
  (63, 'services',    false, -1, 'system'),
  (63, 'resources',   false, -1, 'system'),
  (63, 'operations',  false, -1, 'system'),
  (63, 'cors',        false, -1, 'system'),
  (63, 'fields',      false, -1, 'system'),
  (63, 'scopes',      false, -1, 'system'),
  (63, 'preferences', false, -1, 'system'),
  (63, 'users',       false, -1, 'system'),
  (63, 'roles',       false, -1, 'system')
ON CONFLICT DO NOTHING;
