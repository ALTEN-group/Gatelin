--
-- Default role inserts
--

INSERT INTO role ("appId", name, description, color, locked, "creatorId", "creatorName") VALUES
  (1, 'Gatelin super admin', 'Admin role with full permissions',                                 '#FF8000', true, -1, 'system'),
  (1, 'Gatelin admin',       'Administrator role with most permissions except locking entities', '#0000FF', true, -1, 'system'),
  (1, 'Gatelin user',        'Standard user role with read-only access to public fields',        '#008000', true, -1, 'system'),
  (1, 'Gatelin guest',       'Guest user role with minimal permissions',                         '#808080', true, -1, 'system')
ON CONFLICT DO NOTHING;
