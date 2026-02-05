
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
('ms-auth', false, -1, 'system'),
('ms-user', false, -1, 'system')
;


INSERT INTO api ("serviceId", name, protected, "creatorId", "creatorName") VALUES
(1, 'consumers', true, -1, 'system'),
(1, 'routes', true, -1, 'system'),
(1, 'services', true, -1, 'system'),
(1, 'cors', true, -1, 'system'),
(3, 'users', false, -1, 'system'),
(3, 'user', false, -1, 'system'),
(3, 'profile', false, -1, 'system'),
(3, 'permissions', false, -1, 'system')
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

(1, 4, 'search', 'Search cors', 'gatelin/cors/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'history', 'Manage cors history', 'gatelin/cors/(?<corsId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'update', 'Update cors', 'gatelin/cors', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'add', 'Add cors', 'gatelin/cors', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'archive', 'Archive cors', 'gatelin/cors/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 4, 'delete', 'Delete cors', 'gatelin/cors', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(2, 5, 'register', 'Sign up a new user', '/users/account', ARRAY['POST', 'OPTIONS']::method[], false, false, -1, 'system'),
(2, 5, 'account-get', 'get account', '/users/account', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system'),

(2, 6, 'assets', 'Get user assets', '/user/', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system'),
(2, 7, 'manage', 'User manages is own profile', '/profile', ARRAY['GET', 'PUT', 'POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(2, 5, 'search', 'Search users', '/users/search', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),

(2, 8, 'search', 'get all permissions', '/permissions', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system')
;


ANALYZE;
