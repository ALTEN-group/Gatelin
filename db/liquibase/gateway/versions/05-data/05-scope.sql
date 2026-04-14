-- Scope seed data
-- Each scope name matches a resource name and is linked to the getPreferences route (id=41)
-- The scope value is matched against the URL segment immediately after the resource name in checkAcl

INSERT INTO scope ("routeId", name, archived, "creatorId", "creatorName") VALUES
(41, 'session',     false, -1, 'system'),
(41, 'consumers',   false, -1, 'system'),
(41, 'routes',      false, -1, 'system'),
(41, 'services',    false, -1, 'system'),
(41, 'resources',   false, -1, 'system'),
(41, 'operations',  false, -1, 'system'),
(41, 'cors',        false, -1, 'system'),
(41, 'fields',      false, -1, 'system'),
(41, 'scopes',      false, -1, 'system'),
(41, 'preferences', false, -1, 'system'),
(41, 'users',       false, -1, 'system'),
(41, 'roles',       false, -1, 'system')
;
