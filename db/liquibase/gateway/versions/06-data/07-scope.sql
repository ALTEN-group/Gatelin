-- Scope seed data
-- Each scope name matches a resource name and is linked to the getPreferences route (id=50)
-- The scope value is matched against the URL segment immediately after the resource name in checkAcl

INSERT INTO scopes ("routeId", name, archived, "creatorId", "creatorName") VALUES
(50, 'session',     false, -1, 'system'),
(50, 'consumers',   false, -1, 'system'),
(50, 'routes',      false, -1, 'system'),
(50, 'services',    false, -1, 'system'),
(50, 'resources',   false, -1, 'system'),
(50, 'operations',  false, -1, 'system'),
(50, 'cors',        false, -1, 'system'),
(50, 'fields',      false, -1, 'system'),
(50, 'scopes',      false, -1, 'system'),
(50, 'preferences', false, -1, 'system'),
(50, 'users',       false, -1, 'system'),
(50, 'roles',       false, -1, 'system')
;
