--
-- eBoutique test services
--

-- eBoutique services
INSERT INTO service ("appId", name, pattern, locked, "creatorId", "creatorName")
SELECT a.id, v.name, v.pattern, v.locked, -1, 'system'
FROM application a,
(VALUES
  ('ms-product',  'products',  false),
  ('ms-order',    'orders',    false),
  ('ms-cart',     'cart',      false),
  ('ms-customer', 'customers', false)
) AS v(name, pattern, locked)
WHERE a.name = 'eBoutique'
ON CONFLICT DO NOTHING;

-- eBoutique Admin services
INSERT INTO service ("appId", name, pattern, locked, "creatorId", "creatorName")
SELECT a.id, v.name, v.pattern, v.locked, -1, 'system'
FROM application a,
(VALUES
  ('ms-catalog',   'catalog',   false),
  ('ms-reporting', 'reporting', false)
) AS v(name, pattern, locked)
WHERE a.name = 'eBoutique Admin'
ON CONFLICT DO NOTHING;
