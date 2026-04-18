
INSERT INTO routes ("resourceId", pattern, name, description, methods, "isProtected", locked, "creatorId", "creatorName") VALUES

-- sessions
(1, '',  'refreshToken', 'Refresh a token or Sign in with a refresh token', '["PUT","OPTIONS"]', true, true,-1, 'system'),
(1, '',  'signIn',  'Sign in a user with email & password', '["POST","OPTIONS"]', false, true,-1, 'system'),
(1, '',  'signOut', 'Sign out a user', '["DELETE","OPTIONS"]', true, true, -1, 'system'),
-- consumers
(2, '/search',  'getConsumers',    'Search consumers',  '["POST","OPTIONS"]', true, true, -1, 'system'),
(2, '/archive', 'archiveConsumers', 'Archive consumers', '["POST","OPTIONS"]', true, true, -1, 'system'),
-- routes
(3, '/search',             'searchRoutes',   'Search routes',       '["POST","OPTIONS"]', true, true, -1, 'system'),
(3, '/(?<id>\d+)/history', 'getRouteHistory', 'Manage route history', '["GET","OPTIONS"]', true, true, -1, 'system'),
(3, '',                    'updateRoutes',   'Update routes',       '["PUT","OPTIONS"]', true, true, -1, 'system'),
(3, '',                    'addRoutes',      'Add routes',          '["POST","OPTIONS"]', true, true, -1, 'system'),
(3, '/archive',            'archiveRoutes',  'Archive routes',      '["POST","OPTIONS"]', true, true, -1, 'system'),
-- services
(4, '/search',             'searchServices',   'Search services',       '["POST","OPTIONS"]', true, true, -1, 'system'),
(4, '/(?<id>\d+)/history', 'getServiceHistory', 'Manage service history', '["GET","OPTIONS"]', true, true, -1, 'system'),
(4, '',                    'updateServices',   'Update services',       '["PUT","OPTIONS"]', true, true, -1, 'system'),
(4, '',                    'addServices',      'Add services',          '["POST","OPTIONS"]', true, true, -1, 'system'),
(4, '/archive',            'archiveServices',  'Archive services',      '["POST","OPTIONS"]', true, true, -1, 'system'),
-- resources
(5, '/search',             'searchResources',   'Search resources',        '["POST","OPTIONS"]', true, true, -1, 'system'),
(5, '/(?<id>\d+)/history', 'getResourceHistory', 'Manage resources history', '["GET","OPTIONS"]', true, true, -1, 'system'),
(5, '',                    'updateResources',   'Update resources',        '["PUT","OPTIONS"]', true, true, -1, 'system'),
(5, '',                    'addResources',      'Add resources',           '["POST","OPTIONS"]', true, true, -1, 'system'),
(5, '/archive',            'archiveResources',  'Archive resources',       '["POST","OPTIONS"]', true, true, -1, 'system'),
-- operations
(6, '/search',             'searchOperations',   'Search operations',        '["POST","OPTIONS"]', true, true, -1, 'system'),
(6, '/(?<id>\d+)/history', 'getOperationHistory', 'Manage operations history', '["GET","OPTIONS"]', true, true, -1, 'system'),
(6, '',                    'updateOperations',   'Update operations',        '["PUT","OPTIONS"]', true, true, -1, 'system'),
(6, '',                    'addOperations',      'Add operations',           '["POST","OPTIONS"]', true, true, -1, 'system'),
(6, '/archive',            'archiveOperations',  'Archive operations',       '["POST","OPTIONS"]', true, true, -1, 'system'),
-- cors
(7, '/search',             'searchCors',    'Search cors',        '["POST","OPTIONS"]', true, true, -1, 'system'),
(7, '/(?<id>\d+)/history', 'getCorsHistory', 'Manage cors history', '["GET","OPTIONS"]', true, true, -1, 'system'),
(7, '',                    'updateCors',    'Update cors',        '["PUT","OPTIONS"]', true, true, -1, 'system'),
(7, '',                    'addCors',       'Add cors',           '["POST","OPTIONS"]', true, true, -1, 'system'),
(7, '/archive',            'archiveCors',   'Archive cors',       '["POST","OPTIONS"]', true, true, -1, 'system'),
-- fields
(8, '/search',             'searchFields',    'Search fields',        '["POST","OPTIONS"]', true, true, -1, 'system'),
(8, '/(?<id>\d+)/history', 'getFieldHistory',  'Manage field history',  '["GET","OPTIONS"]', true, true, -1, 'system'),
(8, '',                    'updateFields',    'Update fields',        '["PUT","OPTIONS"]', true, true, -1, 'system'),
(8, '',                    'addFields',       'Add fields',           '["POST","OPTIONS"]', true, true, -1, 'system'),
(8, '/archive',            'archiveFields',   'Archive fields',       '["POST","OPTIONS"]', true, true, -1, 'system'),
-- scopes
(9,  '/search',             'searchScopes',    'Search scopes',        '["POST","OPTIONS"]', true, true, -1, 'system'),
(9,  '/(?<id>\d+)/history', 'getScopeHistory',  'Manage scope history',  '["GET","OPTIONS"]', true, true, -1, 'system'),
(9,  '',                    'updateScopes',    'Update scopes',        '["PUT","OPTIONS"]', true, true, -1, 'system'),
(9,  '',                    'addScopes',       'Add scopes',           '["POST","OPTIONS"]', true, true, -1, 'system'),
(9,  '/archive',            'archiveScopes',   'Archive scopes',       '["POST","OPTIONS"]', true, true, -1, 'system'),
-- roles
(10, '/search',             'searchRoles',    'Search roles',        '["POST","OPTIONS"]', true, false, -1, 'system'),
(10, '/(?<id>\d+)/history', 'getRoleHistory',  'Manage role history',  '["GET","OPTIONS"]', true, false, -1, 'system'),
(10, '',                    'addRoles',       'Add roles',           '["POST","OPTIONS"]', true, false, -1, 'system'),
(10, '',                    'updateRoles',    'Update roles',        '["PUT","OPTIONS"]', true, false, -1, 'system'),
(10, '/archive',            'archiveRoles',   'Archive roles',       '["POST","OPTIONS"]', true, false, -1, 'system'),
-- permissions
(11, '/search',  'searchPermissions',  'Search permissions',  '["POST","OPTIONS"]', true, false, -1, 'system'),
(11, '',         'addPermissions',     'Add permissions',     '["POST","OPTIONS"]', true, false, -1, 'system'),
(11, '',         'updatePermissions',  'Update permissions',  '["PUT","OPTIONS"]', true, false, -1, 'system'),
(11, '/archive', 'deletePermissions',  'Delete permissions',  '["POST","OPTIONS"]', true, false, -1, 'system'),
-- preferences
(12, '/(?<resource>[\w\-]+)', 'getPreferences',  'Get preferences for the authenticated consumer',  '["GET","OPTIONS"]', true, true, -1, 'system'),
(12, '/(?<resource>[\w\-]+)', 'syncPreferences', 'Sync preferences for the authenticated consumer', '["PUT","OPTIONS"]', true, true, -1, 'system'),
-- users
(13, '/me',                    'getBasicUserInfo',    'Get authenticated user basic info', '["GET","OPTIONS"]', true, true, -1, 'system')
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
-- permissions:    46=searchPermissions, 47=addPermissions, 48=updatePermissions, 49=deletePermissions
(46, 2), (46, 3),
(47, 7),
(48, 5),
(49, 9),
-- preferences:    50=getPreferences, 51=syncPreferences
(50, 2),
(51, 12),
-- users:          52=getBasicUserInfo
(52, 1)

;

ANALYZE;
