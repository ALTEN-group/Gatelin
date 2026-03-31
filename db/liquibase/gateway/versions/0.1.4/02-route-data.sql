
INSERT INTO route ("resourceId", "operationId", pattern, name, description, methods, "isProtected", locked, "creatorId", "creatorName") VALUES

-- sessions
(1, 3,  '', 'refreshToken', 'Refresh a token or Sign in with a refresh token', ARRAY['PUT', 'OPTIONS']::method[], true, true,-1, 'system'),
(1, 5,  '', 'signIn',  'Sign in a user with email & password', ARRAY['POST', 'OPTIONS']::method[], false, true,-1, 'system'),
(1, 7,  '', 'signOut', 'Sign out a user', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),
-- consumers
(2, 2,  '/search',  'getConsumers',    'Search consumers', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 8,  '/archive', 'archiveConsumers', 'Delete consumers', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- routes
(3, 2, '/search',             'searchRoutes',   'Search routes',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 2, '/(?<id>\d+)/history', 'getRouteHistory', 'Manage route history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(3, 4, '',                    'updateRoutes',   'Update routes',       ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(3, 6, '',                    'addRoutes',      'Add routes',          ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 8, '/archive',            'archiveRoutes',  'Archive routes',      ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- services
(4, 2, '/search',             'searchServices',   'Search services',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 2, '/(?<id>\d+)/history', 'getServiceHistory', 'Manage service history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(4, 4, '',                    'updateServices',   'Update services',       ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(4, 6, '',                    'addServices',      'Add services',          ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 8, '/archive',            'archiveServices',  'Archive services',      ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- resources
(5, 2, '/search',             'searchResources',   'Search resources',        ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 2, '/(?<id>\d+)/history', 'getResourceHistory', 'Manage resources history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(5, 4, '',                    'updateResources',   'Update resources',        ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(5, 6, '',                    'addResources',      'Add resources',           ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 8, '/archive',            'archiveResources',  'Archive resources',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- operations
(6, 2, '/search',             'searchOperations',   'Search operations',        ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 2, '/(?<id>\d+)/history', 'getOperationHistory', 'Manage operations history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(6, 4, '',                    'updateOperations',   'Update operations',        ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(6, 6, '',                    'addOperations',      'Add operations',           ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 8, '/archive',            'archiveOperations',  'Archive operations',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- cors
(7, 2, '/search',             'searchCors',    'Search cors',        ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(7, 2, '/(?<id>\d+)/history', 'getCorsHistory', 'Manage cors history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(7, 4, '',                    'updateCors',    'Update cors',        ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(7, 6, '',                    'addCors',       'Add cors',           ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(7, 8, '/archive',            'archiveCors',   'Archive cors',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- preferences
(8, 2,  '/(?<tableName>[a-zA-Z0-9_-]+)', 'getPreferences',  'Get preferences for the authenticated user and a given table',  ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(8, 11, '/(?<tableName>[a-zA-Z0-9_-]+)', 'syncPreferences', 'Sync preferences for the authenticated user and a given table', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
-- users
(9, 1,  '/me',                                         'getBasicUserInfo',  'Get basic user info at login',                                              ARRAY['GET',  'OPTIONS']::method[], true, false, -1, 'system'),
(9, 2,  '/preferences/(?<tableName>[a-zA-Z0-9_-]+)', 'getUserPreferences',  'Get preferences for the authenticated user and a given table (users service)',  ARRAY['GET', 'OPTIONS']::method[], true, true,  -1, 'system'),
(9, 11, '/preferences/(?<tableName>[a-zA-Z0-9_-]+)', 'syncUserPreferences', 'Sync preferences for the authenticated user and a given table (users service)', ARRAY['PUT', 'OPTIONS']::method[], true, true,  -1, 'system'),
-- roles
(10, 2,  '/search',                                  'searchRoles',        'Search roles',                                                              ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(10, 2,  '/preferences/(?<tableName>[a-zA-Z0-9_-]+)', 'getRolePreferences',  'Get preferences for the authenticated user and a given table (roles service)',  ARRAY['GET', 'OPTIONS']::method[], true, true,  -1, 'system'),
(10, 11, '/preferences/(?<tableName>[a-zA-Z0-9_-]+)', 'syncRolePreferences', 'Sync preferences for the authenticated user and a given table (roles service)', ARRAY['PUT', 'OPTIONS']::method[], true, true,  -1, 'system')

;

ANALYZE;
