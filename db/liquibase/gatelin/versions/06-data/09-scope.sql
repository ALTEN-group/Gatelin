-- Scope seed data
-- Each scope name matches a resource name and is linked to the getPreferences route
-- The scope value is matched against the URL segment immediately after the resource name in checkAcl

INSERT INTO scopes ("routeId", name, core, archived, "creatorId", "creatorName") VALUES
  (63, 'session',     true, false, -1, 'system'),
  (63, 'consumers',   true, false, -1, 'system'),
  (63, 'routes',      true, false, -1, 'system'),
  (63, 'services',    true, false, -1, 'system'),
  (63, 'resources',   true, false, -1, 'system'),
  (63, 'operations',  true, false, -1, 'system'),
  (63, 'cors',        true, false, -1, 'system'),
  (63, 'fields',      true, false, -1, 'system'),
  (63, 'scopes',      true, false, -1, 'system'),
  (63, 'preferences', true, false, -1, 'system'),
  (63, 'users',       true, false, -1, 'system'),
  (63, 'roles',       true, false, -1, 'system')
ON CONFLICT DO NOTHING;
