--
-- eBoutique test roles
--

-- eBoutique Web roles
INSERT INTO role ("appId", name, description, color, active, "creatorId", "creatorName")
SELECT a.id, v.name, v.description, v.color, v.active, -1, 'system'
FROM application a,
(VALUES
  ('eBoutique user',   'Standard user role with access to shop features',        '#008000', true)
) AS v(name, description, color, active)
WHERE a.name = 'eBoutique'
ON CONFLICT DO NOTHING;

-- eBoutique Admin roles
INSERT INTO role ("appId", name, description, color, active, "creatorId", "creatorName")
SELECT a.id, v.name, v.description, v.color, v.active, -1, 'system'
FROM application a,
(VALUES
  ('eBoutique super admin', 'Administrator role with full permissions',                         '#FF8000', true),
  ('eBoutique admin',       'Administrator role with most permissions except locking entities', '#0000FF', true)
) AS v(name, description, color, active)
WHERE a.name = 'eBoutique Admin'
ON CONFLICT DO NOTHING;
