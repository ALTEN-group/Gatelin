
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


INSERT INTO operation (name, description) VALUES
('read', 'Retrieve a single resource'),
('list', 'Search multiple resources'),
('create', 'Create a new resource'),
('bulk create', 'Create multiple new resources'),
('update', 'Update an existing resource'),
('bulk update', 'Update multiple existing resources'),
('archive', 'Archive a resource'),
('bulk archive', 'Archive multiple resources'),
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
