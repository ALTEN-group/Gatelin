--
-- Default role inserts
-- Colors reference the seeded color table (order matches 08-color-data.sql):
--   1=red  2=orange  3=yellow  4=green  5=teal  6=blue  7=purple  8=pink  9=brown  10=gray  11=black  12=white
--

INSERT INTO role (name, description, "colorId", active, "creatorId", "creatorName") VALUES
  ('Super admin', 'Administrator role with full permissions',                         2,  true, -1, 'system'),
  ('Admin',       'Administrator role with most permissions except locking entities', 6,  true, -1, 'system'),
  ('User',        'Standard user role with read-only access to public fields',        4,  true, -1, 'system'),
  ('Guest',       'Guest user role with minimal permissions',                         10, true, -1, 'system')
ON CONFLICT DO NOTHING;
