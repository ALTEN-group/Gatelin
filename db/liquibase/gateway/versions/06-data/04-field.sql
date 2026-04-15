-- Resource IDs:
--  1=session, 2=consumers, 3=routes, 4=services, 5=resources
--  6=operations, 7=cors, 8=fields, 9=scopes, 10=roles, 11=colors, 12=permissions, 13=preferences, 14=users

INSERT INTO field ("resourceId", name, locked, "creatorId", "creatorName") VALUES

-- consumers (resourceId=2)
(2, 'id',           true,  -1, 'system'),
(2, 'userId',       true,  -1, 'system'),
(2, 'nickname',     false, -1, 'system'),
(2, 'accessToken',  true,  -1, 'system'),
(2, 'refreshToken', true,  -1, 'system'),
(2, 'roles',        false, -1, 'system'),
(2, 'archived',     true,  -1, 'system'),
(2, 'archivedAt',   true,  -1, 'system'),

-- routes (resourceId=3)
(3, 'id',            true,  -1, 'system'),
(3, 'serviceId',     true,  -1, 'system'),
(3, 'serviceName',   true,  -1, 'system'),
(3, 'resourceId',    true,  -1, 'system'),
(3, 'resourceName',  true,  -1, 'system'),
(3, 'operationId',   true,  -1, 'system'),
(3, 'operationName', true,  -1, 'system'),
(3, 'pattern',       false, -1, 'system'),
(3, 'name',          false, -1, 'system'),
(3, 'description',   false, -1, 'system'),
(3, 'methods',       false, -1, 'system'),
(3, 'isProtected',   false, -1, 'system'),
(3, 'locked',        true,  -1, 'system'),
(3, 'archived',      true,  -1, 'system'),
(3, 'archivedAt',    true,  -1, 'system'),

-- services (resourceId=4)
(4, 'id',         true,  -1, 'system'),
(4, 'name',       false, -1, 'system'),
(4, 'pattern',    false, -1, 'system'),
(4, 'locked',     true,  -1, 'system'),
(4, 'archived',   true,  -1, 'system'),
(4, 'archivedAt', true,  -1, 'system'),

-- resources (resourceId=5)
(5, 'id',          true,  -1, 'system'),
(5, 'serviceId',   true,  -1, 'system'),
(5, 'serviceName', true,  -1, 'system'),
(5, 'name',        false, -1, 'system'),
(5, 'locked',      true,  -1, 'system'),
(5, 'archived',    true,  -1, 'system'),
(5, 'archivedAt',  true,  -1, 'system'),

-- operations (resourceId=6)
(6, 'id',          true,  -1, 'system'),
(6, 'name',        false, -1, 'system'),
(6, 'description', false, -1, 'system'),
(6, 'createdAt',   true,  -1, 'system'),
(6, 'creatorName', true,  -1, 'system'),
(6, 'updatedAt',   true,  -1, 'system'),
(6, 'updaterName', true,  -1, 'system'),
(6, 'archived',    true,  -1, 'system'),
(6, 'archivedAt',  true,  -1, 'system'),

-- cors (resourceId=7)
(7, 'id',         true,  -1, 'system'),
(7, 'name',       false, -1, 'system'),
(7, 'archived',   true,  -1, 'system'),
(7, 'archivedAt', true,  -1, 'system'),

-- scopes (resourceId=9)
(9, 'id',         true,  -1, 'system'),
(9, 'routeId',    true,  -1, 'system'),
(9, 'routeName',  true,  -1, 'system'),
(9, 'name',       false, -1, 'system'),
(9, 'archived',   true,  -1, 'system'),
(9, 'archivedAt', true,  -1, 'system'),

-- roles (resourceId=10)
(10, 'id',          true,  -1, 'system'),
(10, 'name',        false, -1, 'system'),
(10, 'description', false, -1, 'system'),
(10, 'colorId',     false, -1, 'system'),
(10, 'colorName',   false, -1, 'system'),
(10, 'active',      false, -1, 'system'),
(10, 'archived',    true,  -1, 'system'),
(10, 'archivedAt',  true,  -1, 'system'),
(10, 'createdAt',   true,  -1, 'system'),
(10, 'creatorName', true,  -1, 'system'),
(10, 'updatedAt',   true,  -1, 'system'),
(10, 'updaterName', true,  -1, 'system'),

-- colors (resourceId=11)
(11, 'id',          true,  -1, 'system'),
(11, 'name',        false, -1, 'system'),
(11, 'code',        false, -1, 'system'),
(11, 'archived',    true,  -1, 'system'),
(11, 'archivedAt',  true,  -1, 'system'),
(11, 'createdAt',   true,  -1, 'system'),
(11, 'creatorName', true,  -1, 'system'),
(11, 'updatedAt',   true,  -1, 'system'),
(11, 'updaterName', true,  -1, 'system')

;

ANALYZE;
