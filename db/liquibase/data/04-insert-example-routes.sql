
-- Add resources for your service
INSERT INTO resource ("serviceId", name, core, "creatorId", "creatorName") VALUES
  ((SELECT id FROM "service" WHERE name='ms-product'), 'products',   false, -1, 'system'),
  ((SELECT id FROM "service" WHERE name='ms-product'), 'categories', false, -1, 'system')
;

-- Add routes  (resourceId values depend on insertion order above — adjust if needed)
-- operation IDs from the seeded data:
--   1=read  2=list  3=export  4=update  5=bulk update  6=create
--   7=bulk create  8=archive  9=bulk archive  10=delete  11=bulk delete
--   12=bulk sync   13=execute
-- method IDs from seeded data: 1=GET 2=POST 3=PUT 4=PATCH 5=DELETE 6=HEAD
-- Note: OPTIONS is handled statically by corsMiddleware — not stored in methodIds
INSERT INTO routes ("resourceId", pattern, name, description, protected, core, "operationId", "methodIds", "creatorId", "creatorName") VALUES
  -- products resource
  ((SELECT id FROM resource WHERE name='products' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '/search',  'searchProducts', 'Search products',  true,  false, ARRAY[2],  ARRAY[2], -1, 'system'),
  ((SELECT id FROM resource WHERE name='products' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'addProduct',     'Add a product',    true,  false, ARRAY[6],  ARRAY[2], -1, 'system'),
  ((SELECT id FROM resource WHERE name='products' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'updateProduct',  'Update a product', true,  false, ARRAY[4],  ARRAY[3], -1, 'system'),
  ((SELECT id FROM resource WHERE name='products' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'deleteProducts', 'Delete products',  true,  false, ARRAY[11], ARRAY[5], -1, 'system'),
  -- categories resource
  ((SELECT id FROM resource WHERE name='categories' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '/search',  'searchCategories', 'Search categories',  true,  false, ARRAY[2],  ARRAY[2], -1, 'system'),
  ((SELECT id FROM resource WHERE name='categories' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'addCategory',      'Add a category',     true,  false, ARRAY[6],  ARRAY[2], -1, 'system'),
  ((SELECT id FROM resource WHERE name='categories' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'updateCategory',   'Update a category',  true,  false, ARRAY[4],  ARRAY[3], -1, 'system'),
  ((SELECT id FROM resource WHERE name='categories' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'deleteCategories', 'Delete categories',  true,  false, ARRAY[11], ARRAY[5], -1, 'system')
;
