
INSERT INTO route ("resourceId", pattern, name, description, methods, "isProtected", locked, "creatorId", "creatorName") VALUES

-- sessions
(1, '',  'refreshToken', 'Refresh a token or Sign in with a refresh token', ARRAY['PUT', 'OPTIONS']::method[], true, true,-1, 'system'),
(1, '',  'signIn',  'Sign in a user with email & password', ARRAY['POST', 'OPTIONS']::method[], false, true,-1, 'system'),
(1, '',  'signOut', 'Sign out a user', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),
-- consumers
(2, '/search',  'getConsumers',    'Search consumers', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, '/archive', 'archiveConsumers', 'Delete consumers', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- routes
(3, '/search',             'searchRoutes',   'Search routes',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, '/(?<id>\d+)/history', 'getRouteHistory', 'Manage route history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(3, '',                    'updateRoutes',   'Update routes',       ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(3, '',                    'addRoutes',      'Add routes',          ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, '/archive',            'archiveRoutes',  'Archive routes',      ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- services
(4, '/search',             'searchServices',   'Search services',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, '/(?<id>\d+)/history', 'getServiceHistory', 'Manage service history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(4, '',                    'updateServices',   'Update services',       ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(4, '',                    'addServices',      'Add services',          ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, '/archive',            'archiveServices',  'Archive services',      ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- resources
(5, '/search',             'searchResources',   'Search resources',        ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, '/(?<id>\d+)/history', 'getResourceHistory', 'Manage resources history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(5, '',                    'updateResources',   'Update resources',        ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(5, '',                    'addResources',      'Add resources',           ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, '/archive',            'archiveResources',  'Archive resources',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- operations
(6, '/search',             'searchOperations',   'Search operations',        ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, '/(?<id>\d+)/history', 'getOperationHistory', 'Manage operations history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(6, '',                    'updateOperations',   'Update operations',        ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(6, '',                    'addOperations',      'Add operations',           ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, '/archive',            'archiveOperations',  'Archive operations',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- cors
(7, '/search',             'searchCors',    'Search cors',        ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(7, '/(?<id>\d+)/history', 'getCorsHistory', 'Manage cors history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(7, '',                    'updateCors',    'Update cors',        ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(7, '',                    'addCors',       'Add cors',           ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(7, '/archive',            'archiveCors',   'Archive cors',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- fields
(8, '/search',             'searchFields',    'Search fields',        ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(8, '/(?<id>\d+)/history', 'getFieldHistory',  'Manage field history',  ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(8, '',                    'updateFields',    'Update fields',        ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(8, '',                    'addFields',       'Add fields',           ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(8, '/archive',            'archiveFields',   'Archive fields',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- scopes
(9,  '/search',             'searchScopes',    'Search scopes',        ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(9,  '/(?<id>\d+)/history', 'getScopeHistory',  'Manage scope history',  ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(9,  '',                    'updateScopes',    'Update scopes',        ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(9,  '',                    'addScopes',       'Add scopes',           ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(9,  '/archive',            'archiveScopes',   'Archive scopes',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- roles
(12, '/search',             'searchRoles',    'Search roles',        ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(12, '/(?<id>\d+)/history', 'getRoleHistory',  'Manage role history',  ARRAY['GET',  'OPTIONS']::method[], true, false, -1, 'system'),
(12, '',                    'addRoles',       'Add roles',           ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(12, '',                    'updateRoles',    'Update roles',        ARRAY['PUT',  'OPTIONS']::method[], true, false, -1, 'system'),
(12, '/archive',            'archiveRoles',   'Archive roles',       ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
-- colors
(13, '/search',             'searchColors',   'Search colors',       ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(13, '/(?<id>\d+)/history', 'getColorHistory', 'Manage color history', ARRAY['GET',  'OPTIONS']::method[], true, true, -1, 'system'),
(13, '',                    'addColors',      'Add colors',          ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(13, '',                    'updateColors',   'Update colors',       ARRAY['PUT',  'OPTIONS']::method[], true, true, -1, 'system'),
(13, '/archive',            'archiveColors',  'Archive colors',      ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
-- preferences
(10, '/(?<resource>[a-zA-Z0-9_-]+)', 'getPreferences',  'Get preferences for the authenticated user and a given table',  ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(10, '/(?<resource>[a-zA-Z0-9_-]+)', 'syncPreferences', 'Sync preferences for the authenticated user and a given table', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
-- users
(11, '/me',                                          'getBasicUserInfo',   'Get basic user info at login',                                               ARRAY['GET',  'OPTIONS']::method[], true, false, -1, 'system'),
(11, '/preferences/(?<resource>[a-zA-Z0-9_-]+)',  'getUserPreferences',  'Get preferences for the authenticated user and a given table (users service)',  ARRAY['GET', 'OPTIONS']::method[], true, true,  -1, 'system'),
(11, '/preferences/(?<resource>[a-zA-Z0-9_-]+)', 'syncUserPreferences', 'Sync preferences for the authenticated user and a given table (users service)', ARRAY['PUT', 'OPTIONS']::method[], true, true,  -1, 'system')

;

-- route IDs follow insertion order above (SERIAL)
INSERT INTO route_operation ("routeId", "operationId") VALUES
-- sessions:       1=refreshToken, 2=signIn, 3=signOut
(1,  4),
(2,  6),
(3,  8),
-- consumers:      4=getConsumers, 5=archiveConsumers
(4,  2), (4,  3),
(5,  9),
-- routes:         6=searchRoutes, 7=getRouteHistory, 8=updateRoutes, 9=addRoutes, 10=archiveRoutes
(6,  2), (6,  3),
(7,  2),
(8,  5),
(9,  7),
(10, 9),
-- services:       11=searchServices, 12=getServiceHistory, 13=updateServices, 14=addServices, 15=archiveServices
(11, 2), (11, 3),
(12, 2),
(13, 5),
(14, 7),
(15, 9),
-- resources:      16=searchResources, 17=getResourceHistory, 18=updateResources, 19=addResources, 20=archiveResources
(16, 2), (16, 3),
(17, 2),
(18, 5),
(19, 7),
(20, 9),
-- operations:     21=searchOperations, 22=getOperationHistory, 23=updateOperations, 24=addOperations, 25=archiveOperations
(21, 2), (21, 3),
(22, 2),
(23, 5),
(24, 7),
(25, 9),
-- cors:           26=searchCors, 27=getCorsHistory, 28=updateCors, 29=addCors, 30=archiveCors
(26, 2), (26, 3),
(27, 2),
(28, 5),
(29, 7),
(30, 9),
-- fields:         31=searchFields, 32=getFieldHistory, 33=updateFields, 34=addFields, 35=archiveFields
(31, 2), (31, 3),
(32, 2),
(33, 5),
(34, 7),
(35, 9),
-- scopes:         36=searchScopes, 37=getScopeHistory, 38=updateScopes, 39=addScopes, 40=archiveScopes
(36, 2), (36, 3),
(37, 2),
(38, 5),
(39, 7),
(40, 9),
-- roles:          41=searchRoles, 42=getRoleHistory, 43=addRoles, 44=updateRoles, 45=archiveRoles
(41, 2), (41, 3),
(42, 2),
(43, 7),
(44, 5),
(45, 9),
-- colors:         46=searchColors, 47=getColorHistory, 48=addColors, 49=updateColors, 50=archiveColors
(46, 2), (46, 3),
(47, 2),
(48, 7),
(49, 5),
(50, 9),
-- preferences:    51=getPreferences, 52=syncPreferences
(51, 2),
(52, 12),
-- users:          53=getBasicUserInfo, 54=getUserPreferences, 55=syncUserPreferences
(53, 1),
(54, 2),
(55, 12)

;

ANALYZE;
