--
-- Default role inserts
--

INSERT INTO role (name, description, color, active, "creatorId", "creatorName") VALUES
  ('Super admin', 'Administrator role with full permissions',                         '#FF8000', true, -1, 'system'),
  ('Admin',       'Administrator role with most permissions except locking entities', '#0000FF', true, -1, 'system'),
  ('User',        'Standard user role with read-only access to public fields',        '#008000', true, -1, 'system'),
  ('Guest',       'Guest user role with minimal permissions',                         '#808080', true, -1, 'system')
ON CONFLICT DO NOTHING;
