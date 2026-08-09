--
-- operation default inserts
--

INSERT INTO operation (name, description, color, "creatorId", "creatorName") VALUES
('read',        'Retrieve a single resource',                            '#3B82F6', -1, 'system'),
('list',        'Search multiple resources',                             '#6366F1', -1, 'system'),
('export',      'Export resources to an external format',                '#8B5CF6', -1, 'system'),
('update',      'Update an existing resource',                           '#F59E0B', -1, 'system'),
('bulk update', 'Update multiple existing resources',                    '#F97316', -1, 'system'),
('create',      'Create a new resource',                                 '#10B981', -1, 'system'),
('bulk create', 'Create multiple new resources',                         '#059669', -1, 'system'),
('archive',     'Archive a resource',                                    '#EF4444', -1, 'system'),
('bulk archive','Archive multiple resources',                            '#DC2626', -1, 'system'),
('delete',      'Delete a resource',                                     '#7F1D1D', -1, 'system'),
('bulk delete', 'Delete multiple resources',                             '#450A0A', -1, 'system'),
('bulk sync',   'Replace the full set of resources in a single operation','#0EA5E9', -1, 'system'),
('execute',     'Execute a specific operation or command',               '#64748B', -1, 'system')
ON CONFLICT DO NOTHING;
