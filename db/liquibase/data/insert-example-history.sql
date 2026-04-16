-- Example history data: one UPDATE record per entity table.
-- INSERT records are already produced automatically by change_trigger when the seed data runs.
-- These UPDATE records simulate a subsequent change to a meaningful field made after the initial seed.

INSERT INTO log.history ("schemaName", "tableName", operation, "consumerId", "consumerName", record) VALUES

-- service id=1: pattern corrected from "gw" to "gateway", locked set to true
('public', 'service', 'UPDATE', -1, 'system',
 '{"id":1,"name":"gatelin","pattern":"gateway","locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- resource id=1 (session): locked set to true
('public', 'resource', 'UPDATE', -1, 'system',
 '{"id":1,"serviceId":1,"name":"session","locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- operation id=1 (read): description refined
('public', 'operation', 'UPDATE', -1, 'system',
 '{"id":1,"name":"read","description":"Retrieve a single resource","archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- cors id=1: port suffix removed from origin
('public', 'cors', 'UPDATE', -1, 'system',
 '{"id":1,"name":"capacitor://localhost","archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- route id=1 (refreshToken): description expanded
('public', 'route', 'UPDATE', -1, 'system',
 '{"id":1,"resourceId":1,"pattern":"","name":"refreshToken","description":"Refresh a token or Sign in with a refresh token","methods":["PUT","OPTIONS"],"isProtected":true,"locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- field id=1 (consumers.id): locked set to true
('public', 'field', 'UPDATE', -1, 'system',
 '{"id":1,"resourceId":2,"name":"id","locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- scope id=1 (session): routeId updated from 55 to 50 after route renumbering
('public', 'scope', 'UPDATE', -1, 'system',
 '{"id":1,"routeId":50,"name":"session","archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb)

;

ANALYZE;
