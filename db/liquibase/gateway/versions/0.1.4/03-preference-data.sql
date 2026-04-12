INSERT INTO preference ("userId", resource, name, conf, "isActive") VALUES

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
  {"key":"methods",       "isVisible":true},
  {"key":"isProtected",   "isVisible":true},
  {"key":"locked",        "isVisible":false},
  {"key":"createdAt",     "isVisible":false},
  {"key":"creatorName",   "isVisible":false},
  {"key":"updatedAt",     "isVisible":false},
  {"key":"updaterName",   "isVisible":false},
  {"key":"archived",      "isVisible":false},
  {"key":"archivedAt",    "isVisible":false}
]', true),
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
  {"key":"methods",       "isVisible":true},
  {"key":"isProtected",   "isVisible":true},
  {"key":"locked",        "isVisible":false},
  {"key":"createdAt",     "isVisible":false},
  {"key":"creatorName",   "isVisible":false},
  {"key":"updatedAt",     "isVisible":false},
  {"key":"updaterName",   "isVisible":false},
  {"key":"archived",      "isVisible":true},
  {"key":"archivedAt",    "isVisible":true}
]', false),
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
  {"key":"methods",       "isVisible":false},
  {"key":"isProtected",   "isVisible":false},
  {"key":"locked",        "isVisible":false},
  {"key":"createdAt",     "isVisible":true},
  {"key":"creatorName",   "isVisible":true},
  {"key":"updatedAt",     "isVisible":true},
  {"key":"updaterName",   "isVisible":true},
  {"key":"archived",      "isVisible":false},
  {"key":"archivedAt",    "isVisible":false}
]', false),

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
]', true),
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
]', false),
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
]', false),

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
]', true),
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
]', false),
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
]', false),

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
]', true),
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
]', false),
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
]', false),

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
]', true),
(3, 'cors', 'Archives', '[
  {"key":"id",         "isVisible":false},
  {"key":"name",       "isVisible":true},
  {"key":"createdAt",  "isVisible":false},
  {"key":"creatorName","isVisible":false},
  {"key":"updatedAt",  "isVisible":false},
  {"key":"updaterName","isVisible":false},
  {"key":"archived",   "isVisible":true},
  {"key":"archivedAt", "isVisible":true}
]', false),
(3, 'cors', 'Audit', '[
  {"key":"id",         "isVisible":false},
  {"key":"name",       "isVisible":true},
  {"key":"createdAt",  "isVisible":true},
  {"key":"creatorName","isVisible":true},
  {"key":"updatedAt",  "isVisible":true},
  {"key":"updaterName","isVisible":true},
  {"key":"archived",   "isVisible":false},
  {"key":"archivedAt", "isVisible":false}
]', false),

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
]', true),
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
]', false),
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
]', false),

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
]', true),
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
]', false),
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
]', false),

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
]', true),
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
]', false),
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
]', false)

;

ANALYZE;
