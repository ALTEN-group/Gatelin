INSERT INTO preference ("userId", "tableName", name, conf, "isActive") VALUES

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
  {"key":"archived",      "isVisible":true},
  {"key":"archivedAt",    "isVisible":true}
]', false),

-- consumers
(3, 'consumers', 'Compact', '[
  {"key":"id",           "isVisible":false},
  {"key":"userId",       "isVisible":true},
  {"key":"nickname",     "isVisible":true},
  {"key":"accessToken",  "isVisible":false, "defaultWidth":"300px"},
  {"key":"refreshToken", "isVisible":false, "defaultWidth":"300px"},
  {"key":"roles",        "isVisible":true},
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
  {"key":"archived",     "isVisible":true},
  {"key":"archivedAt",   "isVisible":true}
]', false),

-- services
(3, 'services', 'Compact', '[
  {"key":"id",        "isVisible":false},
  {"key":"name",      "isVisible":true},
  {"key":"pattern",   "isVisible":true},
  {"key":"locked",    "isVisible":false},
  {"key":"archived",  "isVisible":false},
  {"key":"archivedAt","isVisible":false}
]', true),
(3, 'services', 'Archives', '[
  {"key":"id",        "isVisible":false},
  {"key":"name",      "isVisible":true},
  {"key":"pattern",   "isVisible":true},
  {"key":"locked",    "isVisible":false},
  {"key":"archived",  "isVisible":true},
  {"key":"archivedAt","isVisible":true}
]', false),

-- resources
(3, 'resources', 'Compact', '[
  {"key":"id",          "isVisible":false},
  {"key":"serviceId",   "isVisible":false},
  {"key":"serviceName", "isVisible":true},
  {"key":"name",        "isVisible":true},
  {"key":"locked",      "isVisible":false},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', true),
(3, 'resources', 'Archives', '[
  {"key":"id",          "isVisible":false},
  {"key":"serviceId",   "isVisible":false},
  {"key":"serviceName", "isVisible":true},
  {"key":"name",        "isVisible":true},
  {"key":"locked",      "isVisible":false},
  {"key":"archived",    "isVisible":true},
  {"key":"archivedAt",  "isVisible":true}
]', false),

-- cors
(3, 'cors', 'Compact', '[
  {"key":"id",        "isVisible":false},
  {"key":"name",      "isVisible":true},
  {"key":"archived",  "isVisible":false},
  {"key":"archivedAt","isVisible":false}
]', true),
(3, 'cors', 'Archives', '[
  {"key":"id",        "isVisible":false},
  {"key":"name",      "isVisible":true},
  {"key":"archived",  "isVisible":true},
  {"key":"archivedAt","isVisible":true}
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
]', false)

;

ANALYZE;
