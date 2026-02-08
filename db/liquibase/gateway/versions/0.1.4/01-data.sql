
--
-- default inserts
--

INSERT INTO cors (name, "creatorId", "creatorName") VALUES
('capacitor://localhost', -1, 'system'),
('ionic://localhost', -1, 'system'),
('http://localhost', -1, 'system')
;


INSERT INTO "service" (name, protected, "creatorId", "creatorName") VALUES 
('gatelin', true, -1, 'system'),
('ms-auth-mock', false, -1, 'system'),
('ms-user-mock', false, -1, 'system')
;


INSERT INTO api ("serviceId", name, protected, "creatorId", "creatorName") VALUES
(1, 'consumers', true, -1, 'system'),
(1, 'routes', true, -1, 'system'),
(1, 'services', true, -1, 'system'),
(1, 'apis', true, -1, 'system'),
(1, 'cors', true, -1, 'system'),
(3, 'users', false, -1, 'system'),
(3, 'roles', false, -1, 'system')
;


-- INSERT INTO service_cors ("serviceId", "corsId") VALUES
-- (1, 1),
-- (1, 2),
-- (1, 3),
-- (2, 1),
-- (2, 2),
-- (2, 3)
-- ;


INSERT INTO route ("serviceId", "apiId", action, description, pattern, methods, jwt, protected, "creatorId", "creatorName") VALUES

(1, 1, 'search', 'Search consumers', 'gatelin/consumers/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 1, 'update', 'Refresh a token or Sign in with a refresh token', 'gatelin/consumers', ARRAY['PUT', 'OPTIONS']::method[], true, true,-1, 'system'),
(1, 1, 'add', 'Sign in a user with email & password', 'gatelin/consumers', ARRAY['POST', 'OPTIONS']::method[], false, true,-1, 'system'),
(1, 1, 'archive', 'Sign out a user', 'gatelin/consumers/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 1, 'delete', 'Delete consumers', 'gatelin/consumers', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(1, 2, 'search', 'Search routes', 'gatelin/routes/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 2, 'history', 'Manage route history', 'gatelin/routes/(?<routeId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 2, 'update', 'Update routes', 'gatelin/routes', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 2, 'add', 'Add routes', 'gatelin/routes', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 2, 'archive', 'Archive routes', 'gatelin/routes/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 2, 'delete', 'Delete routes', 'gatelin/routes', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(1, 3, 'search', 'Search services', 'gatelin/services/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 3, 'history', 'Manage service history', 'gatelin/services/(?<serviceId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 3, 'update', 'Update services', 'gatelin/services', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 3, 'add', 'Add services', 'gatelin/services', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 3, 'archive', 'Archive services', 'gatelin/services/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 3, 'delete', 'Delete services', 'gatelin/services', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(1, 4, 'search', 'Search apis', 'gatelin/apis/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'history', 'Manage apis history', 'gatelin/apis/(?<apiId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'update', 'Update apis', 'gatelin/apis', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'add', 'Add apis', 'gatelin/apis', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'archive', 'Archive apis', 'gatelin/apis/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'delete', 'Delete apis', 'gatelin/apis', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(1, 5, 'search', 'Search cors', 'gatelin/cors/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 5, 'history', 'Manage cors history', 'gatelin/cors/(?<corsId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 5, 'update', 'Update cors', 'gatelin/cors', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 5, 'add', 'Add cors', 'gatelin/cors', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 5, 'archive', 'Archive cors', 'gatelin/cors/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 5, 'delete', 'Delete cors', 'gatelin/cors', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(3, 6, 'search', 'Search users', 'users/users/search', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 6, 'history', 'Manage users history', 'users/users/(?<userId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 6, 'update', 'Update users', 'users/users', ARRAY['PUT', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 6, 'add', 'Add users', 'users/users', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 6, 'archive', 'Archive users', 'users/users/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 6, 'delete', 'Delete users', 'users/users', ARRAY['DELETE', 'OPTIONS']::method[], true, false, -1, 'system'),

(3, 7, 'search', 'Search roles', 'users/roles/search', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 7, 'history', 'Manage roles history', 'users/roles/(?<roleId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 7, 'update', 'Update roles', 'users/roles', ARRAY['PUT', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 7, 'add', 'Add roles', 'users/roles', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 7, 'archive', 'Archive roles', 'users/roles/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, false, -1, 'system'),
(3, 7, 'delete', 'Delete roles', 'users/roles', ARRAY['DELETE', 'OPTIONS']::method[], true, false, -1, 'system')
;

ANALYZE;
