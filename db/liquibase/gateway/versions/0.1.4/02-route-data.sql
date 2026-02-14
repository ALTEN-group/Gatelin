
INSERT INTO route ("resourceId", "operationId", description, pattern, methods, jwt, protected, "creatorId", "creatorName") VALUES

(1, 2, 'Search consumers', 'gatelin/consumers/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 5, 'Refresh a token or Sign in with a refresh token', 'gatelin/consumers', ARRAY['PUT', 'OPTIONS']::method[], true, true,-1, 'system'),
(1, 3, 'Sign in a user with email & password', 'gatelin/consumers', ARRAY['POST', 'OPTIONS']::method[], false, true,-1, 'system'),
(1, 7, 'Sign out a user', 'gatelin/consumers/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 10, 'Delete consumers', 'gatelin/consumers', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(2, 2,'Search routes', 'gatelin/routes/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 2, 'Manage route history', 'gatelin/routes/(?<routeId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 5, 'Update routes', 'gatelin/routes', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 4, 'Add routes', 'gatelin/routes', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 8, 'Archive routes', 'gatelin/routes/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 10, 'Delete routes', 'gatelin/routes', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(3, 2, 'Search services', 'gatelin/services/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 2, 'Manage service history', 'gatelin/services/(?<serviceId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 5, 'Update services', 'gatelin/services', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 4, 'Add services', 'gatelin/services', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 8, 'Archive services', 'gatelin/services/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 10, 'Delete services', 'gatelin/services', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(4, 2, 'Search resources', 'gatelin/resources/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 2, 'Manage resources history', 'gatelin/resources/(?<resourceId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 5, 'Update resources', 'gatelin/resources', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 4, 'Add resources', 'gatelin/resources', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 8, 'Archive resources', 'gatelin/resources/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 10, 'Delete resources', 'gatelin/resources', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(5, 2, 'Search operations', 'gatelin/operations/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 2, 'Manage operations history', 'gatelin/operations/(?<actionId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 5, 'Update operations', 'gatelin/operations', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 4, 'Add operations', 'gatelin/operations', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 8, 'Archive operations', 'gatelin/operations/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 10, 'Delete operations', 'gatelin/operations', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(6, 2, 'Search cors', 'gatelin/cors/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 2, 'Manage cors history', 'gatelin/cors/(?<corsId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 5, 'Update cors', 'gatelin/cors', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 4, 'Add cors', 'gatelin/cors', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 8, 'Archive cors', 'gatelin/cors/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 10, 'Delete cors', 'gatelin/cors', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(7, 2, 'Search roles', 'roles/roles/search', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 2, 'Manage roles history', 'roles/roles/(?<roleId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 5, 'Update roles', 'roles/roles', ARRAY['PUT', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 4, 'Add roles', 'roles/roles', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 8, 'Archive roles', 'roles/roles/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 10, 'Delete roles', 'roles/roles', ARRAY['DELETE', 'OPTIONS']::method[], true, false, -1, 'system')
;

ANALYZE;
