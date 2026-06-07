--
-- eBoutique test services
--

-- eBoutique services
INSERT INTO service ("appId", name, pattern, "creatorId", "creatorName")
SELECT a.id, v.name, v.pattern, -1, 'system'
FROM application a,
(VALUES
  ('ms-product',  'products'),
  ('ms-order',    'orders'),
  ('ms-cart',     'cart'),
  ('ms-customer', 'customers')
) AS v(name, pattern)
WHERE a.name = 'eBoutique'
ON CONFLICT DO NOTHING;

-- eBoutique Admin services
INSERT INTO service ("appId", name, pattern, "creatorId", "creatorName")
SELECT a.id, v.name, v.pattern, -1, 'system'
FROM application a,
(VALUES
  ('ms-catalog',   'catalog'),
  ('ms-reporting', 'reporting')
) AS v(name, pattern)
WHERE a.name = 'eBoutique Admin'
ON CONFLICT DO NOTHING;
