INSERT INTO preference ("userId", "tableName", name, conf, "isActive") VALUES

-- routes
(3, 'routes', 'compact', '[
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

-- consumers
(3, 'consumers', 'compact', '[
  {"key":"id",           "isVisible":false},
  {"key":"userId",       "isVisible":true},
  {"key":"nickname",     "isVisible":true},
  {"key":"accessToken",  "isVisible":false, "defaultWidth":"300px"},
  {"key":"refreshToken", "isVisible":false, "defaultWidth":"300px"},
  {"key":"roles",        "isVisible":true},
  {"key":"archived",     "isVisible":false},
  {"key":"archivedAt",   "isVisible":false}
]', true),

-- services
(3, 'services', 'compact', '[
  {"key":"id",        "isVisible":false},
  {"key":"name",      "isVisible":true},
  {"key":"pattern",   "isVisible":true},
  {"key":"locked",    "isVisible":false},
  {"key":"archived",  "isVisible":false},
  {"key":"archivedAt","isVisible":false}
]', true),

-- resources
(3, 'resources', 'compact', '[
  {"key":"id",          "isVisible":false},
  {"key":"serviceId",   "isVisible":false},
  {"key":"serviceName", "isVisible":true},
  {"key":"name",        "isVisible":true},
  {"key":"locked",      "isVisible":false},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', true),

-- cors
(3, 'cors', 'compact', '[
  {"key":"id",        "isVisible":false},
  {"key":"name",      "isVisible":true},
  {"key":"archived",  "isVisible":false},
  {"key":"archivedAt","isVisible":false}
]', true),

-- operations
(3, 'operations', 'compact', '[
  {"key":"id",          "isVisible":false},
  {"key":"name",        "isVisible":true},
  {"key":"description", "isVisible":true},
  {"key":"createdAt",   "isVisible":false},
  {"key":"creatorName", "isVisible":false},
  {"key":"updatedAt",   "isVisible":false},
  {"key":"updaterName", "isVisible":false},
  {"key":"archived",    "isVisible":false},
  {"key":"archivedAt",  "isVisible":false}
]', true)

;

ANALYZE;
