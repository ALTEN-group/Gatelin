-- Scope seed data
-- Each scope name matches a resource name and is linked to the getPreferences route (id=58)
-- The scope value is matched against the URL segment immediately after the resource name in checkAcl

INSERT INTO scopes ("routeId", name, archived, "creatorId", "creatorName") VALUES
(58, 'session',     false, -1, 'system'),
(58, 'consumers',   false, -1, 'system'),
(58, 'routes',      false, -1, 'system'),
(58, 'services',    false, -1, 'system'),
(58, 'resources',   false, -1, 'system'),
(58, 'operations',  false, -1, 'system'),
(58, 'cors',        false, -1, 'system'),
(58, 'fields',      false, -1, 'system'),
(58, 'scopes',      false, -1, 'system'),
(58, 'preferences', false, -1, 'system'),
(58, 'users',       false, -1, 'system'),
(58, 'roles',       false, -1, 'system')
;
