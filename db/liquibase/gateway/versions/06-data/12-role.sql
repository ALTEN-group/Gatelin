--
-- Default role inserts
--

INSERT INTO role ("appId", name, description, color, active, locked, "creatorId", "creatorName")
SELECT a.id, v.name, v.description, v.color, v.active, v.locked, -1, 'system'
FROM application a,
(VALUES
  ('Gatelin super admin', 'Admin role with full permissions',                                 '#FF8000', true,  true),
  ('Gatelin admin',       'Administrator role with most permissions except locking entities', '#0000FF', true,  true),
  ('Gatelin user',        'Standard user role with read-only access to public fields',        '#008000', true,  true),
  ('Gatelin guest',       'Guest user role with minimal permissions',                         '#808080', true,  true)
) AS v(name, description, color, active, locked)
WHERE a.name = 'Gatelin'
ON CONFLICT DO NOTHING;
