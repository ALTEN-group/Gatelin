-- First update pass: one UPDATE per table to establish initial history entries

-- cors id=1: typo in origin
UPDATE cors SET
  name = 'capacito://localhost',
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE id = 1;
