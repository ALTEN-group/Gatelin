--
-- Rename Gatelin's control-plane prefix without changing historical seed
-- changesets (which would invalidate Liquibase checksums).
--

UPDATE service
SET
  pattern = 'gatelin',
  "updatedAt" = NOW(),
  "updaterId" = -1,
  "updaterName" = 'system'
WHERE name = 'gatelin'
  AND pattern = 'gateway';
