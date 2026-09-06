--
-- operation default inserts
--

INSERT INTO operation (name, description, color, core, "creatorId", "creatorName") VALUES
('read',        'Retrieve a single resource',                            '#3B82F6', true, -1, 'system'),
('list',        'Search multiple resources',                             '#6366F1', true, -1, 'system'),
('export',      'Export resources to an external format',                '#8B5CF6', true, -1, 'system'),
('update',      'Update an existing resource',                           '#F59E0B', true, -1, 'system'),
('bulk update', 'Update multiple existing resources',                    '#F97316', true, -1, 'system'),
('create',      'Create a new resource',                                 '#10B981', true, -1, 'system'),
('bulk create', 'Create multiple new resources',                         '#059669', true, -1, 'system'),
('archive',     'Archive a resource',                                    '#EF4444', true, -1, 'system'),
('bulk archive','Archive multiple resources',                            '#DC2626', true, -1, 'system'),
('delete',      'Delete a resource',                                     '#7F1D1D', true, -1, 'system'),
('bulk delete', 'Delete multiple resources',                             '#450A0A', true, -1, 'system'),
('bulk sync',   'Replace the full set of resources in a single operation','#0EA5E9', true, -1, 'system'),
('execute',     'Execute a specific operation or command',               '#64748B', true, -1, 'system')
ON CONFLICT DO NOTHING;
