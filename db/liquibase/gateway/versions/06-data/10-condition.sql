--
-- Reusable condition seed data
-- Each condition defines a row-level filter forwarded via x-acl-conditions header
-- to downstream services. $var placeholders are resolved against the authenticated consumer.
--

INSERT INTO condition (name, "fieldId", op, value, "creatorId", "creatorName") VALUES
(
  'Non-archived only',
  (SELECT f.id FROM field f JOIN resource r ON r.id = f."resourceId" JOIN service s ON s.id = r."serviceId" WHERE s.name = 'gatelin' AND r.name = 'consumers'  AND f.name = 'archived'),
  '=', 'false', -1, 'system'
),
(
  'Own preferences',
  (SELECT f.id FROM field f JOIN resource r ON r.id = f."resourceId" JOIN service s ON s.id = r."serviceId" WHERE s.name = 'gatelin' AND r.name = 'preferences' AND f.name = 'consumerId'),
  '=', '$consumerId', -1, 'system'
),
(
  'Own user record',
  (SELECT f.id FROM field f JOIN resource r ON r.id = f."resourceId" JOIN service s ON s.id = r."serviceId" WHERE s.name = 'ms-user-mock' AND r.name = 'users' AND f.name = 'id'),
  '=', '$consumerId', -1, 'system'
)
;
