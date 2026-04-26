
-- operations: 1=read 2=list 3=export 4=update 5=bulk-update 6=create 7=bulk-create 8=archive 9=bulk-archive 10=delete 11=bulk-delete 12=bulk-sync 13=execute
-- methodIds:  1=GET  2=POST  3=PUT   4=PATCH  5=DELETE      6=HEAD  7=OPTIONS
-- Note: OPTIONS is handled statically by corsMiddleware before checkRoute — not stored in methodIds

INSERT INTO routes ("resourceId", pattern, name, description, protected, locked, operations, "methodIds", "creatorId", "creatorName") VALUES

-- sessions
(1, '',  'refreshToken', 'Refresh a token or Sign in with a refresh token', true,  true,  ARRAY[4],    ARRAY[3],   -1, 'system'),
(1, '',  'signIn',       'Sign in a user with email & password',             false, true,  ARRAY[6],    ARRAY[2],   -1, 'system'),
(1, '',  'signOut',      'Sign out a user',                                  true,  true,  ARRAY[8],    ARRAY[5],   -1, 'system'),
-- consumers
(2, '/search',  'getConsumers',     'Search consumers',   true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(2, '/archive', 'archiveConsumers', 'Archive consumers',  true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- routes
(3, '/search',             'searchRoutes',    'Search routes',        true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(3, '/(?<id>\d+)/history', 'getRouteHistory', 'Manage route history', true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(3, '',                    'updateRoutes',    'Update routes',        true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(3, '',                    'addRoutes',       'Add routes',           true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(3, '/archive',            'archiveRoutes',   'Archive routes',       true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- services
(4, '/search',             'searchServices',    'Search services',         true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(4, '/(?<id>\d+)/history', 'getServiceHistory', 'Manage service history',  true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(4, '',                    'updateServices',    'Update services',         true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(4, '',                    'addServices',       'Add services',            true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(4, '/archive',            'archiveServices',   'Archive services',        true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- resources
(5, '/search',             'searchResources',    'Search resources',          true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(5, '/(?<id>\d+)/history', 'getResourceHistory', 'Manage resources history',  true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(5, '',                    'updateResources',    'Update resources',          true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(5, '',                    'addResources',       'Add resources',             true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(5, '/archive',            'archiveResources',   'Archive resources',         true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- operations
(6, '/search',             'searchOperations',    'Search operations',          true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(6, '/(?<id>\d+)/history', 'getOperationHistory', 'Manage operations history',  true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(6, '',                    'updateOperations',    'Update operations',          true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(6, '',                    'addOperations',       'Add operations',             true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(6, '/archive',            'archiveOperations',   'Archive operations',         true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- cors
(7, '/search',             'searchCors',     'Search cors',         true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(7, '/(?<id>\d+)/history', 'getCorsHistory', 'Manage cors history', true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(7, '',                    'updateCors',     'Update cors',         true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(7, '',                    'addCors',        'Add cors',            true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(7, '/archive',            'archiveCors',    'Archive cors',        true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- fields
(8, '/search',             'searchFields',    'Search fields',        true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(8, '/(?<id>\d+)/history', 'getFieldHistory', 'Manage field history', true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(8, '',                    'updateFields',    'Update fields',        true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(8, '',                    'addFields',       'Add fields',           true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(8, '/archive',            'archiveFields',   'Archive fields',       true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- scopes
(9, '/search',             'searchScopes',    'Search scopes',        true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(9, '/(?<id>\d+)/history', 'getScopeHistory', 'Manage scope history', true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(9, '',                    'updateScopes',    'Update scopes',        true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(9, '',                    'addScopes',       'Add scopes',           true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(9, '/archive',            'archiveScopes',   'Archive scopes',       true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- roles
(10, '/search',             'searchRoles',    'Search roles',        true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(10, '/(?<id>\d+)/history', 'getRoleHistory', 'Manage role history', true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(10, '',                    'addRoles',       'Add roles',           true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(10, '',                    'updateRoles',    'Update roles',        true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(10, '/archive',            'archiveRoles',   'Archive roles',       true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- permissions
(11, '/search',                       'searchPermissions',    'Search permissions',          true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(11, '/history/route/(?<routeId>\d+)', 'getPermissionHistory', 'Get permission history by route', true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(11, '',                              'addPermissions',       'Add permissions',             true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(11, '',                              'updatePermissions',    'Update permissions',          true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(11, '/archive',                      'deletePermissions',    'Delete permissions',          true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- methods (resourceId=12)
(12, '/search', 'searchMethods', 'Search methods', true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(12, '',        'updateMethods', 'Update methods', true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
-- applications (resourceId=13)
(13, '/search',             'searchApplications',    'Search applications',          true, true, ARRAY[2,3], ARRAY[2],   -1, 'system'),
(13, '/(?<id>\d+)/history', 'getApplicationHistory', 'Manage application history',   true, true, ARRAY[2],   ARRAY[1],   -1, 'system'),
(13, '',                    'addApplications',       'Add applications',             true, true, ARRAY[7],   ARRAY[2],   -1, 'system'),
(13, '',                    'updateApplications',    'Update applications',          true, true, ARRAY[5],   ARRAY[3],   -1, 'system'),
(13, '/archive',            'archiveApplications',   'Archive applications',         true, true, ARRAY[9],   ARRAY[2],   -1, 'system'),
-- preferences (resourceId=14)
(14, '/(?<resource>[\w\-]+)', 'getPreferences',  'Get preferences for the authenticated consumer',  true, true, ARRAY[2],  ARRAY[1],   -1, 'system'),
(14, '/(?<resource>[\w\-]+)', 'syncPreferences', 'Sync preferences for the authenticated consumer', true, true, ARRAY[12], ARRAY[3],   -1, 'system'),
-- users (resourceId=15)
(15, '/me', 'getBasicUserInfo', 'Get authenticated user basic info for the admin', true, true, ARRAY[1], ARRAY[1],   -1, 'system')
;

ANALYZE;

