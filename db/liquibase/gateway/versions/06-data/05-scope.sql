-- Scope seed data
-- Each scope name matches a resource name and is linked to the getPreferences route (id=55)
-- The scope value is matched against the URL segment immediately after the resource name in checkAcl

INSERT INTO scope ("routeId", name, archived, "creatorId", "creatorName") VALUES
(55, 'session',     false, -1, 'system'),
(55, 'consumers',   false, -1, 'system'),
(55, 'routes',      false, -1, 'system'),
(55, 'services',    false, -1, 'system'),
(55, 'resources',   false, -1, 'system'),
(55, 'operations',  false, -1, 'system'),
(55, 'cors',        false, -1, 'system'),
(55, 'fields',      false, -1, 'system'),
(55, 'scopes',      false, -1, 'system'),
(55, 'preferences', false, -1, 'system'),
(55, 'users',       false, -1, 'system'),
(55, 'roles',       false, -1, 'system')
;
