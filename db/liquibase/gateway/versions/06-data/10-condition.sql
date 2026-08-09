--
-- Reusable condition seed data
-- Each condition defines a row-level filter forwarded via x-acl-conditions header
-- to downstream services. $var placeholders are resolved against the authenticated consumer.
--

INSERT INTO conditions (name, "fieldId", op, value, color, "creatorId", "creatorName") VALUES
  ('Non-archived only', 7,  '=', 'false', '#6366F1', -1, 'system'),
  ('Non-core only',     22, '=', 'false', '#8B5CF6', -1, 'system')
ON CONFLICT DO NOTHING;
