-- Example data: add your own services, resources and routes
-- The following are already seeded by the schema migration and must NOT be duplicated:
--   services  : gatelin (id=1), ms-user-mock (id=2), ms-role-mock (id=3)
--   resources : session, consumers, routes, services, resources, operations,
--               cors, fields, scopes, preferences (gatelin), users, roles
--   operations: read, list, export, update, bulk update, create, bulk create,
--               archive, bulk archive, delete, bulk delete, bulk sync, execute

-- Add your own service
INSERT INTO "service" (name, pattern, locked, "creatorId", "creatorName") VALUES
  ('ms-product', 'products', false, -1, 'system')
;

-- Add resources for your service
INSERT INTO resource ("serviceId", name, locked, "creatorId", "creatorName") VALUES
  ((SELECT id FROM "service" WHERE name='ms-product'), 'products',   false, -1, 'system'),
  ((SELECT id FROM "service" WHERE name='ms-product'), 'categories', false, -1, 'system')
;

-- Add routes  (resourceId values depend on insertion order above — adjust if needed)
-- operation IDs from the seeded data:
--   1=read  2=list  3=export  4=update  5=bulk update  6=create
--   7=bulk create  8=archive  9=bulk archive  10=delete  11=bulk delete
--   12=bulk sync   13=execute
INSERT INTO route ("resourceId", pattern, name, description, methods, "isProtected", locked, "creatorId", "creatorName") VALUES
  -- products resource
  ((SELECT id FROM resource WHERE name='products' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '/search',  'searchProducts', 'Search products',  ARRAY['POST',   'OPTIONS']::method[], true,  false, -1, 'system'),
  ((SELECT id FROM resource WHERE name='products' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'addProduct',     'Add a product',    ARRAY['POST',   'OPTIONS']::method[], true,  false, -1, 'system'),
  ((SELECT id FROM resource WHERE name='products' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'updateProduct',  'Update a product', ARRAY['PUT',    'OPTIONS']::method[], true,  false, -1, 'system'),
  ((SELECT id FROM resource WHERE name='products' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'deleteProducts', 'Delete products',  ARRAY['DELETE', 'OPTIONS']::method[], true,  false, -1, 'system'),
  -- categories resource
  ((SELECT id FROM resource WHERE name='categories' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '/search',  'searchCategories', 'Search categories',  ARRAY['POST',   'OPTIONS']::method[], true,  false, -1, 'system'),
  ((SELECT id FROM resource WHERE name='categories' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'addCategory',      'Add a category',     ARRAY['POST',   'OPTIONS']::method[], true,  false, -1, 'system'),
  ((SELECT id FROM resource WHERE name='categories' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'updateCategory',   'Update a category',  ARRAY['PUT',    'OPTIONS']::method[], true,  false, -1, 'system'),
  ((SELECT id FROM resource WHERE name='categories' AND "serviceId"=(SELECT id FROM "service" WHERE name='ms-product')),
   '',         'deleteCategories', 'Delete categories',  ARRAY['DELETE', 'OPTIONS']::method[], true,  false, -1, 'system')
;

-- Route ↔ Operation mapping (operation ids from seeded data)
INSERT INTO route_operation ("routeId", "operationId")
  SELECT r.id, o.id FROM route r, operation o
  WHERE (r.name = 'searchProducts'   AND o.name = 'list')
     OR (r.name = 'addProduct'       AND o.name = 'create')
     OR (r.name = 'updateProduct'    AND o.name = 'update')
     OR (r.name = 'deleteProducts'   AND o.name = 'bulk delete')
     OR (r.name = 'searchCategories' AND o.name = 'list')
     OR (r.name = 'addCategory'      AND o.name = 'create')
     OR (r.name = 'updateCategory'   AND o.name = 'update')
     OR (r.name = 'deleteCategories' AND o.name = 'bulk delete')
ON CONFLICT DO NOTHING;

