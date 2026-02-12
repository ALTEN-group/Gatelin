
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
('ms-user-mock', false, -1, 'system'),
('ms-roles-mock', false, -1, 'system')
;


INSERT INTO operation (name, description, "creatorId", "creatorName") VALUES
('read', 'Retrieve a single resource', -1, 'system'),
('list', 'Search multiple resources', -1, 'system'),
('create', 'Create a new resource', -1, 'system'),
('bulk create', 'Create multiple new resources', -1, 'system'),
('update', 'Update an existing resource', -1, 'system'),
('bulk update', 'Update multiple existing resources', -1, 'system'),
('archive', 'Archive a resource', -1, 'system'),
('bulk archive', 'Archive multiple resources', -1, 'system'),
('delete', 'Delete a resource', -1, 'system'),
('bulk delete', 'Delete multiple resources', -1, 'system'),
('execute', 'Execute a specific operation or command', -1, 'system')
;


INSERT INTO resource ("serviceId", name, protected, "creatorId", "creatorName") VALUES
(1, 'consumers', true, -1, 'system'),
(1, 'routes', true, -1, 'system'),
(1, 'services', true, -1, 'system'),
(1, 'resources', true, -1, 'system'),
(1, 'actions', true, -1, 'system'),
(1, 'cors', true, -1, 'system'),
(3, 'users', false, -1, 'system'),
(4, 'roles', false, -1, 'system')
;
