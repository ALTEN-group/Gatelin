--
-- Default role inserts
--

INSERT INTO role ("appId", name, description, color, active, "creatorId", "creatorName")
SELECT a.id, v.name, v.description, v.color, v.active, -1, 'system'
FROM application a,
(VALUES
  ('Super admin', 'Administrator role with full permissions',                         '#FF8000', true),
  ('Admin',       'Administrator role with most permissions except locking entities', '#0000FF', true),
  ('User',        'Standard user role with read-only access to public fields',        '#008000', true),
  ('Guest',       'Guest user role with minimal permissions',                         '#808080', true)
) AS v(name, description, color, active)
WHERE a.name = 'Gatelin'
ON CONFLICT DO NOTHING;
