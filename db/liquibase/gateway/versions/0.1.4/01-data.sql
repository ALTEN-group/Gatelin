
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


INSERT INTO action (name, description) VALUES
('read', 'Retrieve a single resource'),
('list', 'Search multiple resources'),
('create', 'Create a new resource'),
('bulk create', 'Create multiple new resources'),
('update', 'Update an existing resource'),
('bulk update', 'Update multiple existing resources'),
('delete', 'Delete a resource'),
('bulk delete', 'Delete multiple resources'),
('execute', 'Execute a specific operation or command')
;


INSERT INTO resource ("serviceId", name, protected, "creatorId", "creatorName") VALUES
(1, 'consumers', true, -1, 'system'),
(1, 'routes', true, -1, 'system'),
(1, 'services', true, -1, 'system'),
(1, 'resources', true, -1, 'system'),
(1, 'actions', true, -1, 'system'),
(1, 'cors', true, -1, 'system'),
(3, 'users', false, -1, 'system'),
(3, 'roles', false, -1, 'system')
;


INSERT INTO route ("resourceId", description, pattern, methods, jwt, protected, "creatorId", "creatorName") VALUES

(1, 'Search consumers', 'gatelin/consumers/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 'Refresh a token or Sign in with a refresh token', 'gatelin/consumers', ARRAY['PUT', 'OPTIONS']::method[], true, true,-1, 'system'),
(1, 'Sign in a user with email & password', 'gatelin/consumers', ARRAY['POST', 'OPTIONS']::method[], false, true,-1, 'system'),
(1, 'Sign out a user', 'gatelin/consumers/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(1, 'Delete consumers', 'gatelin/consumers', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(2, 'Search routes', 'gatelin/routes/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 'Manage route history', 'gatelin/routes/(?<routeId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 'Update routes', 'gatelin/routes', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 'Add routes', 'gatelin/routes', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 'Archive routes', 'gatelin/routes/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(2, 'Delete routes', 'gatelin/routes', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(3, 'Search services', 'gatelin/services/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 'Manage service history', 'gatelin/services/(?<serviceId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 'Update services', 'gatelin/services', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 'Add services', 'gatelin/services', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 'Archive services', 'gatelin/services/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(3, 'Delete services', 'gatelin/services', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(4, 'Search resources', 'gatelin/resources/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 'Manage resources history', 'gatelin/resources/(?<resourceId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 'Update resources', 'gatelin/resources', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 'Add resources', 'gatelin/resources', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 'Archive resources', 'gatelin/resources/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(4, 'Delete resources', 'gatelin/resources', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(5, 'Search actions', 'gatelin/actions/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 'Manage actions history', 'gatelin/actions/(?<actionId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 'Update actions', 'gatelin/actions', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 'Add actions', 'gatelin/actions', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 'Archive actions', 'gatelin/actions/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(5, 'Delete actions', 'gatelin/actions', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(6, 'Search cors', 'gatelin/cors/search', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 'Manage cors history', 'gatelin/cors/(?<corsId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 'Update cors', 'gatelin/cors', ARRAY['PUT', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 'Add cors', 'gatelin/cors', ARRAY['POST', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 'Archive cors', 'gatelin/cors/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, true, -1, 'system'),
(6, 'Delete cors', 'gatelin/cors', ARRAY['DELETE', 'OPTIONS']::method[], true, true, -1, 'system'),

(7, 'Search users', 'users/users/search', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 'Manage users history', 'users/users/(?<userId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 'Update users', 'users/users', ARRAY['PUT', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 'Add users', 'users/users', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 'Archive users', 'users/users/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, false, -1, 'system'),
(7, 'Delete users', 'users/users', ARRAY['DELETE', 'OPTIONS']::method[], true, false, -1, 'system'),

(8, 'Search roles', 'users/roles/search', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 'Manage roles history', 'users/roles/(?<roleId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 'Update roles', 'users/roles', ARRAY['PUT', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 'Add roles', 'users/roles', ARRAY['POST', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 'Archive roles', 'users/roles/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, false, -1, 'system'),
(8, 'Delete roles', 'users/roles', ARRAY['DELETE', 'OPTIONS']::method[], true, false, -1, 'system')
;

ANALYZE;
