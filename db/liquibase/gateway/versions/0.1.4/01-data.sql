
--
-- default inserts
--

INSERT INTO cors (name, "creatorId", "creatorName") VALUES
('capacitor://localhost', -1, 'system'),
('ionic://localhost', -1, 'system'),
('http://localhost', -1, 'system')
;


INSERT INTO "service" (name, "creatorId", "creatorName") VALUES 
('gatelin', -1, 'system'),
('ms-auth', -1, 'system'),
('ms-user', -1, 'system')
;


INSERT INTO service_cors ("serviceId", "corsId") VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3)
;


INSERT INTO route ("serviceId", api, action, description, pattern, methods, jwt, "creatorId", "creatorName") VALUES

(1, 'consumers', 'search', 'Search consumers', 'gatelin/consumers/search', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
-- (1, 'consumers', 'history', 'Manage consumer history', 'gatelin/consumers/(?<consumerId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'consumers', 'update', 'Refresh a token or Sign in with a refresh token', 'gatelin/consumers', ARRAY['PUT', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'consumers', 'add', 'Sign in a user with email & password', 'gatelin/consumers', ARRAY['POST', 'OPTIONS']::method[], false, -1, 'system'),
(1, 'consumers', 'archive', 'Sign out a user', 'gatelin/consumers/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'consumers', 'delete', 'Delete consumers', 'gatelin/consumers', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(1, 'routes', 'search', 'Search routes', 'gatelin/routes/search', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes', 'history', 'Manage route history', 'gatelin/routes/(?<routeId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes', 'update', 'Update routes', 'gatelin/routes', ARRAY['PUT', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes', 'add', 'Add routes', 'gatelin/routes', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes', 'archive', 'Archive routes', 'gatelin/routes/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes', 'delete', 'Delete routes', 'gatelin/routes', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(1, 'services', 'search', 'Search services', 'gatelin/services/search', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'services', 'history', 'Manage service history', 'gatelin/services/(?<serviceId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'services', 'update', 'Update services', 'gatelin/services', ARRAY['PUT', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'services', 'add', 'Add services', 'gatelin/services', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'services', 'archive', 'Archive services', 'gatelin/services/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'services', 'delete', 'Delete services', 'gatelin/services', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(1, 'cors', 'search', 'Search cors', 'gatelin/cors/search', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'cors', 'history', 'Manage cors history', 'gatelin/cors/(?<corsId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'cors', 'update', 'Update cors', 'gatelin/cors', ARRAY['PUT', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'cors', 'add', 'Add cors', 'gatelin/cors', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'cors', 'archive', 'Archive cors', 'gatelin/cors/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'cors', 'delete', 'Delete cors', 'gatelin/cors', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(2, 'users', 'register', 'Sign up a new user', '/users/account', ARRAY['POST', 'OPTIONS']::method[], false, -1, 'system'),
(2, 'users', 'account-get', 'get account', '/users/account', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),

(2, 'user', 'assets', 'Get user assets', '/user/', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'profile', 'manage', 'User manages is own profile', '/profile', ARRAY['GET', 'PUT', 'POST', 'OPTIONS']::method[], true, -1, 'system'),

(2, 'users', 'search', 'Search users', '/users/search', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),

(2, 'permissions', 'search', 'get all permissions', '/permissions', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system')
;


ANALYZE;
