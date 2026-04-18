-- Second update pass: corrective UPDATE per table to produce a later history timestamp


-- cors id=1: fix origin
UPDATE cors SET
  name = 'capacitor://localhost',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;
-- cors id=1: fix origin
UPDATE cors SET
  name = 'ionic://localhost',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 2;
-- cors id=1: fix origin
UPDATE cors SET
  name = 'http://localhost',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 3;
