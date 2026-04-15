-- Scope seed data
-- Each scope name matches a resource name and is linked to the getPreferences route (id=51)
-- The scope value is matched against the URL segment immediately after the resource name in checkAcl

INSERT INTO scope ("routeId", name, archived, "creatorId", "creatorName") VALUES
(51, 'session',     false, -1, 'system'),
(51, 'consumers',   false, -1, 'system'),
(51, 'routes',      false, -1, 'system'),
(51, 'services',    false, -1, 'system'),
(51, 'resources',   false, -1, 'system'),
(51, 'operations',  false, -1, 'system'),
(51, 'cors',        false, -1, 'system'),
(51, 'fields',      false, -1, 'system'),
(51, 'scopes',      false, -1, 'system'),
(51, 'preferences', false, -1, 'system'),
(51, 'users',       false, -1, 'system'),
(51, 'roles',       false, -1, 'system')
;
