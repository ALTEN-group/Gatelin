
INSERT INTO route ("resourceId", "operationId", description, pattern, methods, jwt, locked, "creatorId", "creatorName") VALUES

(1, 2, 'Search consumers', '/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 5, 'Refresh a token or Sign in with a refresh token', '', ARRAY['PUT', 'OPTIONS']::method[], true, true,-1, 'system'),
(1, 3, 'Sign in a user with email & password', '', ARRAY['POST', 'OPTIONS']::method[], false, true,-1, 'system'),
(1, 7, 'Sign out a user', '/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 10, 'Delete consumers', '', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(2, 2,'Search routes', '/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 2, 'Manage route history', '/(?<routeId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 5, 'Update routes', '', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 4, 'Add routes', '', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 8, 'Archive routes', '/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 10, 'Delete routes', '', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(3, 2, 'Search services', '/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 2, 'Manage service history', '/(?<serviceId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 5, 'Update services', '', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 4, 'Add services', '', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 8, 'Archive services', '/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 10, 'Delete services', '', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(4, 2, 'Search resources', '/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 2, 'Manage resources history', '/(?<resourceId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 5, 'Update resources', '', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 4, 'Add resources', '', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 8, 'Archive resources', '/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 10, 'Delete resources', '', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(5, 2, 'Search operations', '/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 2, 'Manage operations history', '/(?<actionId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 5, 'Update operations', '', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 4, 'Add operations', '', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 8, 'Archive operations', '/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 10, 'Delete operations', '', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(6, 2, 'Search cors', '/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 2, 'Manage cors history', '/(?<corsId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 5, 'Update cors', '', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 4, 'Add cors', '', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 8, 'Archive cors', '/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 10, 'Delete cors', '', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(7, 1, 'Get basic user info at login', 'me', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system'),

(8, 2, 'Search roles', '/search', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 2, 'Manage roles history', '/(?<roleId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 5, 'Update roles', '', ARRAY['PUT', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 4, 'Add roles', '', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 8, 'Archive roles', '/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 10, 'Delete roles', '', ARRAY['DELETE', 'OPTIONS']::method[], true, false, -1, 'system')
;

ANALYZE;
