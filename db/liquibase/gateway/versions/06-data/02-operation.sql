--
-- operation default inserts
--

INSERT INTO operation (name, description, "creatorId", "creatorName") VALUES
('read', 'Retrieve a single resource', -1, 'system'),
('list', 'Search multiple resources', -1, 'system'),
('export', 'Export resources to an external format', -1, 'system'),
('update', 'Update an existing resource', -1, 'system'),
('bulk update', 'Update multiple existing resources', -1, 'system'),
('create', 'Create a new resource', -1, 'system'),
('bulk create', 'Create multiple new resources', -1, 'system'),
('archive', 'Archive a resource', -1, 'system'),
('bulk archive', 'Archive multiple resources', -1, 'system'),
('delete', 'Delete a resource', -1, 'system'),
('bulk delete', 'Delete multiple resources', -1, 'system'),
('bulk sync', 'Replace the full set of resources in a single operation', -1, 'system'),
('execute', 'Execute a specific operation or command', -1, 'system')
;
