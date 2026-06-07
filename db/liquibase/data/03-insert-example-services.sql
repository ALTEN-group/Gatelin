--
-- eBoutique test services
--

-- eBoutique services
INSERT INTO service (name, pattern, "creatorId", "creatorName")
VALUES
  ('ms-product',  'products',  -1, 'system'),
  ('ms-order',    'orders',    -1, 'system'),
  ('ms-cart',     'cart',      -1, 'system'),
  ('ms-customer', 'customers', -1, 'system')
ON CONFLICT DO NOTHING;

-- eBoutique Admin services
INSERT INTO service (name, pattern, "creatorId", "creatorName")
VALUES
  ('ms-catalog',   'catalog',   -1, 'system'),
  ('ms-reporting', 'reporting', -1, 'system')
ON CONFLICT DO NOTHING;
