INSERT INTO preference ("userId", resource, name, conf, "isActive", "creatorId", "creatorName") VALUES

-- routes
(3, 'routes', 'Compact', '[
  {"key":"id",            "isVisible":false},
  {"key":"serviceId",     "isVisible":false},
  {"key":"serviceName",   "isVisible":true},
  {"key":"resourceId",    "isVisible":false},
  {"key":"resourceName",  "isVisible":true},
  {"key":"pattern",       "isVisible":true},
  {"key":"operationId",   "isVisible":false},
  {"key":"operationName", "isVisible":true},
  {"key":"name",          "isVisible":true},
  {"key":"description",   "isVisible":false},
  {"key":"methodIds",     "isVisible":false},
  {"key":"methodNames",   "isVisible":true},
  {"key":"isProtected",   "isVisible":true},
  {"key":"locked",        "isVisible":false},
  {"key":"createdAt",     "isVisible":false},
  {"key":"creatorName",   "isVisible":false},
  {"key":"updatedAt",     "isVisible":false},
  {"key":"updaterName",   "isVisible":false},
  {"key":"archived",      "isVisible":false},
  {"key":"archivedAt",    "isVisible":false}
]', true, -1, 'system'),
(3, 'routes', 'Archives', '[
  {"key":"id",            "isVisible":false},
  {"key":"serviceId",     "isVisible":false},
  {"key":"serviceName",   "isVisible":true},
  {"key":"resourceId",    "isVisible":false},
  {"key":"resourceName",  "isVisible":true},
  {"key":"pattern",       "isVisible":true},
  {"key":"operationId",   "isVisible":false},
  {"key":"operationName", "isVisible":true},
  {"key":"name",          "isVisible":true},
  {"key":"description",   "isVisible":false},
  {"key":"methodIds",     "isVisible":false},
  {"key":"methodNames",   "isVisible":true},
  {"key":"isProtected",   "isVisible":true},
  {"key":"locked",        "isVisible":false},
  {"key":"createdAt",     "isVisible":false},
  {"key":"creatorName",   "isVisible":false},
  {"key":"updatedAt",     "isVisible":false},
  {"key":"updaterName",   "isVisible":false},
  {"key":"archived",      "isVisible":true},
  {"key":"archivedAt",    "isVisible":true}
]', false, -1, 'system'),
(3, 'routes', 'Audit', '[
  {"key":"id",            "isVisible":false},
  {"key":"serviceId",     "isVisible":false},
  {"key":"serviceName",   "isVisible":true},
  {"key":"resourceId",    "isVisible":false},
  {"key":"resourceName",  "isVisible":true},
  {"key":"pattern",       "isVisible":false},
  {"key":"operationId",   "isVisible":false},
  {"key":"operationName", "isVisible":false},
  {"key":"name",          "isVisible":true},
  {"key":"description",   "isVisible":false},
  {"key":"methodIds",     "isVisible":false},
  {"key":"methodNames",   "isVisible":false},
  {"key":"isProtected",   "isVisible":false},
  {"key":"locked",        "isVisible":false},
  {"key":"createdAt",     "isVisible":true},
  {"key":"creatorName",   "isVisible":true},
  {"key":"updatedAt",     "isVisible":true},
  {"key":"updaterName",   "isVisible":true},
  {"key":"archived",      "isVisible":false},
  {"key":"archivedAt",    "isVisible":false}
]', false, -1, 'system'),

-- consumers
(3, 'consumers', 'Compact', '[
  {"key":"id",           "isVisible":false},
  {"key":"userId",       "isVisible":true},
  {"key":"nickname",     "isVisible":true},
  {"key":"accessToken",  "isVisible":false, "defaultWidth":"300px"},
  {"key":"refreshToken", "isVisible":false, "defaultWidth":"300px"},
  {"key":"roles",        "isVisible":true},
  {"key":"createdAt",    "isVisible":false},
  {"key":"creatorName",  "isVisible":false},
  {"key":"updatedAt",    "isVisible":false},
  {"key":"updaterName",  "isVisible":false},
  {"key":"archived",     "isVisible":false},
  {"key":"archivedAt",   "isVisible":false}
]', true, -1, 'system'),
(3, 'consumers', 'Archives', '[
  {"key":"id",           "isVisible":false},
  {"key":"userId",       "isVisible":true},
  {"key":"nickname",     "isVisible":true},
  {"key":"accessToken",  "isVisible":false, "defaultWidth":"300px"},
  {"key":"refreshToken", "isVisible":false, "defaultWidth":"300px"},
  {"key":"roles",        "isVisible":true},
  {"key":"createdAt",    "isVisible":false},
  {"key":"creatorName",  "isVisible":false},
  {"key":"updatedAt",    "isVisible":false},
  {"key":"updaterName",  "isVisible":false},
  {"key":"archived",     "isVisible":true},
  {"key":"archivedAt",   "isVisible":true}
]', false, -1, 'system'),
(3, 'consumers', 'Audit', '[
  {"key":"id",           "isVisible":false},
  {"key":"userId",       "isVisible":true},
  {"key":"nickname",     "isVisible":true},
  {"key":"accessToken",  "isVisible":false, "defaultWidth":"300px"},
  {"key":"refreshToken", "isVisible":false, "defaultWidth":"300px"},
  {"key":"roles",        "isVisible":false},
  {"key":"createdAt",    "isVisible":true},
  {"key":"creatorName",  "isVisible":true},
  {"key":"updatedAt",    "isVisible":true},
  {"key":"updaterName",  "isVisible":true},
  {"key":"archived",     "isVisible":false},
  {"key":"archivedAt",   "isVisible":false}
]', false, -1, 'system'),

-- services
(3, 'services', 'Compact', '[
  {"key":"id",         "isVisible":false},
  {"key":"name",       "isVisible":true},
  {"key":"pattern",    "isVisible":true},
  {"key":"locked",     "isVisible":false},
  {"key":"createdAt",  "isVisible":false},
  {"key":"creatorName","isVisible":false},
  {"key":"updatedAt",  "isVisible":false},
  {"key":"updaterName","isVisible":false},
  {"key":"archived",   "isVisible":false},
  {"key":"archivedAt", "isVisible":false}
]', true, -1, 'system'),
(3, 'services', 'Archives', '[
  {"key":"id",         "isVisible":false},
  {"key":"name",       "isVisible":true},
  {"key":"pattern",    "isVisible":true},
  {"key":"locked",     "isVisible":false},
  {"key":"createdAt",  "isVisible":false},
  {"key":"creatorName","isVisible":false},
  {"key":"updatedAt",  "isVisible":false},
  {"key":"updaterName","isVisible":false},
  {"key":"archived",   "isVisible":true},
  {"key":"archivedAt", "isVisible":true}
]', false, -1, 'system'),
(3, 'services', 'Audit', '[
  {"key":"id",         "isVisible":false},
  {"key":"name",       "isVisible":true},
  {"key":"pattern",    "isVisible":false},
  {"key":"locked",     "isVisible":false},
  {"key":"createdAt",  "isVisible":true},
  {"key":"creatorName","isVisible":true},
  {"key":"updatedAt",  "isVisible":true},
  {"key":"updaterName","isVisible":true},
  {"key":"archived",   "isVisible":false},
  {"key":"archivedAt", "isVisible":false}
]', false, -1, 'system'),

-- resources
(3, 'resources', 'Compact', '[
  {"key":"id",          "isVisible":false},
  {"key":"serviceId",   "isVisible":false},
  {"key":"serviceName", "isVisible":true},
  {"key":"name",        "isVisible":true},
  {"key":"locked",      "isVisible":false},
  {"key":"createdAt",   "isVisible":false},
  {"key":"creatorName", "isVisible":false},
  {"key":"updatedAt",   "isVisible":false},
  {"key":"updaterName", "isVisible":false},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', true, -1, 'system'),
(3, 'resources', 'Archives', '[
  {"key":"id",          "isVisible":false},
  {"key":"serviceId",   "isVisible":false},
  {"key":"serviceName", "isVisible":true},
  {"key":"name",        "isVisible":true},
  {"key":"locked",      "isVisible":false},
  {"key":"createdAt",   "isVisible":false},
  {"key":"creatorName", "isVisible":false},
  {"key":"updatedAt",   "isVisible":false},
  {"key":"updaterName", "isVisible":false},
  {"key":"archived",    "isVisible":true},
  {"key":"archivedAt",  "isVisible":true}
]', false, -1, 'system'),
(3, 'resources', 'Audit', '[
  {"key":"id",          "isVisible":false},
  {"key":"serviceId",   "isVisible":false},
  {"key":"serviceName", "isVisible":true},
  {"key":"name",        "isVisible":true},
  {"key":"locked",      "isVisible":false},
  {"key":"createdAt",   "isVisible":true},
  {"key":"creatorName", "isVisible":true},
  {"key":"updatedAt",   "isVisible":true},
  {"key":"updaterName", "isVisible":true},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', false, -1, 'system'),

-- cors
(3, 'cors', 'Compact', '[
  {"key":"id",         "isVisible":false},
  {"key":"name",       "isVisible":true},
  {"key":"createdAt",  "isVisible":false},
  {"key":"creatorName","isVisible":false},
  {"key":"updatedAt",  "isVisible":false},
  {"key":"updaterName","isVisible":false},
  {"key":"archived",   "isVisible":false},
  {"key":"archivedAt", "isVisible":false}
]', true, -1, 'system'),
(3, 'cors', 'Archives', '[
  {"key":"id",         "isVisible":false},
  {"key":"name",       "isVisible":true},
  {"key":"createdAt",  "isVisible":false},
  {"key":"creatorName","isVisible":false},
  {"key":"updatedAt",  "isVisible":false},
  {"key":"updaterName","isVisible":false},
  {"key":"archived",   "isVisible":true},
  {"key":"archivedAt", "isVisible":true}
]', false, -1, 'system'),
(3, 'cors', 'Audit', '[
  {"key":"id",         "isVisible":false},
  {"key":"name",       "isVisible":true},
  {"key":"createdAt",  "isVisible":true},
  {"key":"creatorName","isVisible":true},
  {"key":"updatedAt",  "isVisible":true},
  {"key":"updaterName","isVisible":true},
  {"key":"archived",   "isVisible":false},
  {"key":"archivedAt", "isVisible":false}
]', false, -1, 'system'),

-- operations
(3, 'operations', 'Compact', '[
  {"key":"id",          "isVisible":false},
  {"key":"name",        "isVisible":true},
  {"key":"description", "isVisible":true},
  {"key":"createdAt",   "isVisible":false},
  {"key":"creatorName", "isVisible":false},
  {"key":"updatedAt",   "isVisible":false},
  {"key":"updaterName", "isVisible":false},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', true, -1, 'system'),
(3, 'operations', 'Archives', '[
  {"key":"id",          "isVisible":false},
  {"key":"name",        "isVisible":true},
  {"key":"description", "isVisible":true},
  {"key":"createdAt",   "isVisible":false},
  {"key":"creatorName", "isVisible":false},
  {"key":"updatedAt",   "isVisible":false},
  {"key":"updaterName", "isVisible":false},
  {"key":"archived",    "isVisible":true},
  {"key":"archivedAt",  "isVisible":true}
]', false, -1, 'system'),
(3, 'operations', 'Audit', '[
  {"key":"id",          "isVisible":false},
  {"key":"name",        "isVisible":true},
  {"key":"description", "isVisible":false},
  {"key":"createdAt",   "isVisible":true},
  {"key":"creatorName", "isVisible":true},
  {"key":"updatedAt",   "isVisible":true},
  {"key":"updaterName", "isVisible":true},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', false, -1, 'system'),

-- fields
(3, 'fields', 'Compact', '[
  {"key":"id",           "isVisible":false},
  {"key":"resourceId",   "isVisible":false},
  {"key":"resourceName", "isVisible":true},
  {"key":"name",         "isVisible":true},
  {"key":"locked",       "isVisible":false},
  {"key":"createdAt",    "isVisible":false},
  {"key":"creatorName",  "isVisible":false},
  {"key":"updatedAt",    "isVisible":false},
  {"key":"updaterName",  "isVisible":false},
  {"key":"archived",     "isVisible":false},
  {"key":"archivedAt",   "isVisible":false}
]', true, -1, 'system'),
(3, 'fields', 'Archives', '[
  {"key":"id",           "isVisible":false},
  {"key":"resourceId",   "isVisible":false},
  {"key":"resourceName", "isVisible":true},
  {"key":"name",         "isVisible":true},
  {"key":"locked",       "isVisible":false},
  {"key":"createdAt",    "isVisible":false},
  {"key":"creatorName",  "isVisible":false},
  {"key":"updatedAt",    "isVisible":false},
  {"key":"updaterName",  "isVisible":false},
  {"key":"archived",     "isVisible":true},
  {"key":"archivedAt",   "isVisible":true}
]', false, -1, 'system'),
(3, 'fields', 'Audit', '[
  {"key":"id",           "isVisible":false},
  {"key":"resourceId",   "isVisible":false},
  {"key":"resourceName", "isVisible":true},
  {"key":"name",         "isVisible":true},
  {"key":"locked",       "isVisible":false},
  {"key":"createdAt",    "isVisible":true},
  {"key":"creatorName",  "isVisible":true},
  {"key":"updatedAt",    "isVisible":true},
  {"key":"updaterName",  "isVisible":true},
  {"key":"archived",     "isVisible":false},
  {"key":"archivedAt",   "isVisible":false}
]', false, -1, 'system'),

-- scopes
(3, 'scopes', 'Compact', '[
  {"key":"id",          "isVisible":false},
  {"key":"routeId",     "isVisible":false},
  {"key":"routeName",   "isVisible":true},
  {"key":"name",        "isVisible":true},
  {"key":"createdAt",   "isVisible":false},
  {"key":"creatorName", "isVisible":false},
  {"key":"updatedAt",   "isVisible":false},
  {"key":"updaterName", "isVisible":false},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', true, -1, 'system'),
(3, 'scopes', 'Archives', '[
  {"key":"id",          "isVisible":false},
  {"key":"routeId",     "isVisible":false},
  {"key":"routeName",   "isVisible":true},
  {"key":"name",        "isVisible":true},
  {"key":"createdAt",   "isVisible":false},
  {"key":"creatorName", "isVisible":false},
  {"key":"updatedAt",   "isVisible":false},
  {"key":"updaterName", "isVisible":false},
  {"key":"archived",    "isVisible":true},
  {"key":"archivedAt",  "isVisible":true}
]', false, -1, 'system'),
(3, 'scopes', 'Audit', '[
  {"key":"id",          "isVisible":false},
  {"key":"routeId",     "isVisible":false},
  {"key":"routeName",   "isVisible":true},
  {"key":"name",        "isVisible":true},
  {"key":"createdAt",   "isVisible":true},
  {"key":"creatorName", "isVisible":true},
  {"key":"updatedAt",   "isVisible":true},
  {"key":"updaterName", "isVisible":true},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', false, -1, 'system'),

-- roles
(3, 'roles', 'Compact', '[
  {"key":"id",          "isVisible":false},
  {"key":"name",        "isVisible":true},
  {"key":"description", "isVisible":true},
  {"key":"color",       "isVisible":true},
  {"key":"active",      "isVisible":true},
  {"key":"createdAt",   "isVisible":false},
  {"key":"creatorName", "isVisible":false},
  {"key":"updatedAt",   "isVisible":false},
  {"key":"updaterName", "isVisible":false},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', true, -1, 'system'),
(3, 'roles', 'Archives', '[
  {"key":"id",          "isVisible":false},
  {"key":"name",        "isVisible":true},
  {"key":"description", "isVisible":true},
  {"key":"color",       "isVisible":true},
  {"key":"active",      "isVisible":true},
  {"key":"createdAt",   "isVisible":false},
  {"key":"creatorName", "isVisible":false},
  {"key":"updatedAt",   "isVisible":false},
  {"key":"updaterName", "isVisible":false},
  {"key":"archived",    "isVisible":true},
  {"key":"archivedAt",  "isVisible":true}
]', false, -1, 'system'),
(3, 'roles', 'Audit', '[
  {"key":"id",          "isVisible":false},
  {"key":"name",        "isVisible":true},
  {"key":"description", "isVisible":false},
  {"key":"color",       "isVisible":false},
  {"key":"active",      "isVisible":false},
  {"key":"createdAt",   "isVisible":true},
  {"key":"creatorName", "isVisible":true},
  {"key":"updatedAt",   "isVisible":true},
  {"key":"updaterName", "isVisible":true},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', false, -1, 'system')

;

ANALYZE;
