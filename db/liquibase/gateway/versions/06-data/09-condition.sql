--
-- Reusable condition seed data
-- Each condition defines a row-level filter forwarded via x-acl-conditions header
-- to downstream services. $var placeholders are resolved against the authenticated consumer.
--

-- fieldId subqueries resolve to the field table using (resourceId, name)
INSERT INTO condition (name, "fieldId", op, value, "creatorId", "creatorName") VALUES
('Non-archived only', (SELECT id FROM fields WHERE "resourceId" = 2  AND name = 'archived'),   '=', 'false',       -1, 'system'),
('Own preferences',   (SELECT id FROM fields WHERE "resourceId" = 15 AND name = 'consumerId'), '=', '$consumerId', -1, 'system'),
('Own user record',   (SELECT id FROM fields WHERE "resourceId" = 16 AND name = 'id'),         '=', '$consumerId', -1, 'system')
;
