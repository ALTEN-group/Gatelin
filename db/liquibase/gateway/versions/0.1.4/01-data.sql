
--
-- default inserts
--

INSERT INTO cors (name, "creatorId", "creatorName") VALUES
('capacitor://localhost', -1, 'system'),
('ionic://localhost', -1, 'system'),
('http://localhost', -1, 'system')
;


INSERT INTO "service" (name, "creatorId", "creatorName") VALUES 
('ms-gateway', -1, 'system'),
('ms-auth', -1, 'system'),
('ms-user', -1, 'system'),
('ms-excel', -1, 'system'),
('ms-notif', -1, 'system'),
('ms-mail', -1, 'system'),
('ms-cron', -1, 'system'),
('ms-event', -1, 'system')
;


INSERT INTO service_cors ("serviceId", "corsId") VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3)
;


INSERT INTO route ("serviceId", name, description, pattern, methods, jwt, "creatorId", "creatorName") VALUES

(1, 'consumers-search', 'Search consumers', '/consumers/search', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'consumers-history', 'Manage consumer history', '/consumers/(?<consumerId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'consumers-update', 'Refresh a token or Sign in with a refresh token', '/consumers', ARRAY['PUT', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'consumers-add', 'Sign in a user with email & password', '/consumers', ARRAY['POST', 'OPTIONS']::method[], false, -1, 'system'),
(1, 'consumers-archive', 'Sign out a user', '/consumers/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'consumers-delete', 'Delete consumers', '/consumers', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(1, 'routes-search', 'Search routes', '/routes/search', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes-history', 'Manage route history', '/routes/(?<routeId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes-update', 'Update routes', '/routes', ARRAY['PUT', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes-add', 'Add routes', '/routes', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes-archive', 'Archive routes', '/routes/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, -1, 'system'),
(1, 'routes-delete', 'Delete routes', '/routes', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(2, 'register', 'Sign up a new user', '/account', ARRAY['POST', 'OPTIONS']::method[], false, -1, 'system'),
(2, 'account-get', 'get account', '/account', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),

(2, 'userAssets', 'Get user assets', '~/user/', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'profile', 'User manages is own profile', '/profile', ARRAY['GET', 'PUT', 'POST', 'OPTIONS']::method[], true, -1, 'system'),

(2, 'users-search', 'Search users', '/users/search', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'users-history', 'Manage user history', '/users/(?<userId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'users-update', 'Update users', '/users', ARRAY['PUT', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'users-portrait', 'Add or update user portrait', '/users/(?<userId>\\d+)/portrait', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'users-add', 'Add users', '/users', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'users-archive', 'Archive users', '/users/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'users-delete', 'Delete users', '/users', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(2, 'roles-conf', 'Get roles config', '/roles/conf', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'roles-search', 'Search roles', '/roles/search', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'roles-history', 'Manage role history', '/roles/(?<roleId>\\d+)/history', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'roles-update', 'Update a role', '/roles/(?<roleId>\\d+)', ARRAY['PUT', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'roles-add', 'Add a role', '/roles', ARRAY['POST', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'roles-archive', 'Archive a role', '/roles/(?<roleId>\\d+)/archive', ARRAY['PATCH', 'OPTIONS']::method[], true, -1, 'system'),
(2, 'roles-delete', 'Delete roles', '/roles', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(2, 'permissions-search', 'get all permissions', '/permissions', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),

(3, 'excelAssets', 'Get Excel exports', '~/excel/', ARRAY['GET', 'OPTIONS']::method[], true, -1, 'system'),
(3, 'excels-delete', 'Delete Excel exports', '/excels', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(4, 'notifs', 'get notifications', '/notifs', ARRAY['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(5, 'mails', 'manage mails', '/mails', ARRAY['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS']::method[], true, -1, 'system'),
(5, 'mailAssets', 'Get mail assets', '~/mail/', ARRAY['GET', 'OPTIONS']::method[], false, -1, 'system'),
(5, 'mails-delete', 'Delete mails', '/mails', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(6, 'crons', 'manage crons', '/crons', ARRAY['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS']::method[], true, -1, 'system'),

(7, 'events', 'manage events', '/events', ARRAY['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS']::method[], true, -1, 'system'),
(7, 'events-search', 'search events', '/events/search', ARRAY['POST', 'OPTIONS']::method[], false, -1, 'system'),
(7, 'eventAssets', 'Get event assets', '~/event/', ARRAY['GET', 'OPTIONS']::method[], false, -1, 'system'),
(7, 'events-categories', 'get categories', '/categories', ARRAY['GET', 'OPTIONS']::method[], false, -1, 'system'),
(7, 'events-address', 'get address', '/address', ARRAY['GET', 'OPTIONS']::method[], false, -1, 'system'),
(7, 'events-delete', 'Delete events', '/events', ARRAY['DELETE', 'OPTIONS']::method[], true, -1, 'system')
;


ANALYZE;
