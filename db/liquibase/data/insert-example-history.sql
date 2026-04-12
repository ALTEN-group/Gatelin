-- Example history data: one INSERT and one UPDATE record per entity table.
-- consumerId=-1 / consumerName='system' mirrors the seeded entity data.
-- Records reflect realistic snapshots of the seeded rows.

INSERT INTO log.history ("schemaName", "tableName", operation, "consumerId", "consumerName", record) VALUES

-- service id=1 (gatelin)
('public', 'service', 'INSERT', -1, 'system',
 '{"id":1,"name":"gatelin","pattern":"gateway","locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":null,"updaterName":null,"createdAt":"2026-01-01T00:00:00","updatedAt":null}'::jsonb),
('public', 'service', 'UPDATE', -1, 'system',
 '{"id":1,"name":"gatelin","pattern":"gateway","locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- resource id=1 (session)
('public', 'resource', 'INSERT', -1, 'system',
 '{"id":1,"serviceId":1,"name":"session","locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":null,"updaterName":null,"createdAt":"2026-01-01T00:00:00","updatedAt":null}'::jsonb),
('public', 'resource', 'UPDATE', -1, 'system',
 '{"id":1,"serviceId":1,"name":"session","locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- operation id=1 (read)
('public', 'operation', 'INSERT', -1, 'system',
 '{"id":1,"name":"read","description":"Retrieve a single resource","archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":null,"updaterName":null,"createdAt":"2026-01-01T00:00:00","updatedAt":null}'::jsonb),
('public', 'operation', 'UPDATE', -1, 'system',
 '{"id":1,"name":"read","description":"Retrieve a single resource","archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- cors id=1 (capacitor://localhost)
('public', 'cors', 'INSERT', -1, 'system',
 '{"id":1,"name":"capacitor://localhost","archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":null,"updaterName":null,"createdAt":"2026-01-01T00:00:00","updatedAt":null}'::jsonb),
('public', 'cors', 'UPDATE', -1, 'system',
 '{"id":1,"name":"capacitor://localhost","archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- route id=1
('public', 'route', 'INSERT', -1, 'system',
 '{"id":1,"resourceId":1,"pattern":"","name":"createSession","description":"Create a new session","methods":["POST","OPTIONS"],"isProtected":false,"locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":null,"updaterName":null,"createdAt":"2026-01-01T00:00:00","updatedAt":null}'::jsonb),
('public', 'route', 'UPDATE', -1, 'system',
 '{"id":1,"resourceId":1,"pattern":"","name":"createSession","description":"Create a new session","methods":["POST","OPTIONS"],"isProtected":false,"locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- field id=1 (consumers.id)
('public', 'field', 'INSERT', -1, 'system',
 '{"id":1,"resourceId":2,"name":"id","locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":null,"updaterName":null,"createdAt":"2026-01-01T00:00:00","updatedAt":null}'::jsonb),
('public', 'field', 'UPDATE', -1, 'system',
 '{"id":1,"resourceId":2,"name":"id","locked":true,"archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb),

-- scope id=1 (session)
('public', 'scope', 'INSERT', -1, 'system',
 '{"id":1,"routeId":41,"name":"session","archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":null,"updaterName":null,"createdAt":"2026-01-01T00:00:00","updatedAt":null}'::jsonb),
('public', 'scope', 'UPDATE', -1, 'system',
 '{"id":1,"routeId":41,"name":"session","archived":false,"archivedAt":null,"creatorId":-1,"creatorName":"system","updaterId":-1,"updaterName":"system","createdAt":"2026-01-01T00:00:00","updatedAt":"2026-02-01T00:00:00"}'::jsonb)

;

ANALYZE;
