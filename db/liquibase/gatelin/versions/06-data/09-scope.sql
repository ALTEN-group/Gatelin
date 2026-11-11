-- Scope seed data
-- Each scope name matches a resource name and is linked to the getPreferences route
-- The scope value is matched against the URL segment immediately after the resource name in checkAcl

INSERT INTO scopes ("routeId", name, core, archived, "creatorId", "creatorName") VALUES
  (73, 'session',     true, false, -1, 'system'),
  (73, 'consumers',   true, false, -1, 'system'),
  (73, 'routes',      true, false, -1, 'system'),
  (73, 'services',    true, false, -1, 'system'),
  (73, 'resources',   true, false, -1, 'system'),
  (73, 'operations',  true, false, -1, 'system'),
  (73, 'cors',        true, false, -1, 'system'),
  (73, 'fields',      true, false, -1, 'system'),
  (73, 'scopes',      true, false, -1, 'system'),
  (73, 'preferences', true, false, -1, 'system'),
  (73, 'roles',       true, false, -1, 'system')
ON CONFLICT DO NOTHING;
