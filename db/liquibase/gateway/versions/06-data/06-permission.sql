--
-- Default permission data — derived from ms_role mock
--
-- Route IDs (from 02-route.sql insertion order):
--   1=refreshToken      2=signIn            3=signOut
--   4=getConsumers      5=archiveConsumers
--   6=searchRoutes      7=getRouteHistory   8=updateRoutes      9=addRoutes         10=archiveRoutes
--   11=searchServices   12=getServiceHistory 13=updateServices  14=addServices      15=archiveServices
--   16=searchResources  17=getResourceHistory 18=updateResources 19=addResources    20=archiveResources
--   21=searchOperations 22=getOperationHistory 23=updateOperations 24=addOperations 25=archiveOperations
--   26=searchCors       27=getCorsHistory   28=updateCors       29=addCors          30=archiveCors
--   31=searchFields     32=getFieldHistory  33=updateFields     34=addFields        35=archiveFields
--   36=searchScopes     37=getScopeHistory  38=updateScopes     39=addScopes        40=archiveScopes
--   41=searchRoles      42=getRoleHistory   43=addRoles         44=updateRoles      45=archiveRoles
--   46=searchColors     47=getColorHistory  48=addColors        49=updateColors     50=archiveColors
--   51=searchPermissions 52=addPermissions 53=updatePermissions 54=deletePermissions
--   55=getPreferences   56=syncPreferences
--   57=getBasicUserInfo 58=getUserPreferences 59=syncUserPreferences
--
-- Operation IDs (from 01-base.sql insertion order):
--   1=read  2=list  3=export  4=update  5=bulk update  6=create
--   7=bulk create  8=archive  9=bulk archive  10=delete  11=bulk delete  12=bulk sync
--
-- Role IDs (from 08-role.sql insertion order):
--   1=Super admin  2=Admin  3=User  4=Guest
--

INSERT INTO permission ("roleId", "routeId", "operationId", fields) VALUES

-- ============================================================
-- Super admin (1): full access, no field restrictions
-- ============================================================
(1,  1,  4, NULL),  -- refreshToken        → update
(1,  3,  8, NULL),  -- signOut             → archive
(1,  4,  2, NULL),  -- getConsumers        → list
(1,  5,  9, NULL),  -- archiveConsumers    → bulk archive
(1,  6,  2, NULL),  -- searchRoutes        → list
(1,  7,  2, NULL),  -- getRouteHistory     → list
(1,  8,  5, NULL),  -- updateRoutes        → bulk update
(1,  9,  7, NULL),  -- addRoutes           → bulk create
(1, 10,  9, NULL),  -- archiveRoutes       → bulk archive
(1, 11,  2, NULL),  -- searchServices      → list
(1, 12,  2, NULL),  -- getServiceHistory   → list
(1, 13,  5, NULL),  -- updateServices      → bulk update
(1, 14,  7, NULL),  -- addServices         → bulk create
(1, 15,  9, NULL),  -- archiveServices     → bulk archive
(1, 16,  2, NULL),  -- searchResources     → list
(1, 17,  2, NULL),  -- getResourceHistory  → list
(1, 18,  5, NULL),  -- updateResources     → bulk update
(1, 19,  7, NULL),  -- addResources        → bulk create
(1, 20,  9, NULL),  -- archiveResources    → bulk archive
(1, 21,  2, NULL),  -- searchOperations    → list
(1, 22,  2, NULL),  -- getOperationHistory → list
(1, 23,  5, NULL),  -- updateOperations    → bulk update
(1, 24,  7, NULL),  -- addOperations       → bulk create
(1, 25,  9, NULL),  -- archiveOperations   → bulk archive
(1, 26,  2, NULL),  -- searchCors          → list
(1, 27,  2, NULL),  -- getCorsHistory      → list
(1, 28,  5, NULL),  -- updateCors          → bulk update
(1, 29,  7, NULL),  -- addCors             → bulk create
(1, 30,  9, NULL),  -- archiveCors         → bulk archive
(1, 31,  2, NULL),  -- searchFields        → list
(1, 32,  2, NULL),  -- getFieldHistory     → list
(1, 33,  5, NULL),  -- updateFields        → bulk update
(1, 34,  7, NULL),  -- addFields           → bulk create
(1, 35,  9, NULL),  -- archiveFields       → bulk archive
(1, 36,  2, NULL),  -- searchScopes        → list
(1, 37,  2, NULL),  -- getScopeHistory     → list
(1, 38,  5, NULL),  -- updateScopes        → bulk update
(1, 39,  7, NULL),  -- addScopes           → bulk create
(1, 40,  9, NULL),  -- archiveScopes       → bulk archive
(1, 41,  2, NULL),  -- searchRoles         → list
(1, 42,  2, NULL),  -- getRoleHistory      → list
(1, 43,  7, NULL),  -- addRoles            → bulk create
(1, 44,  5, NULL),  -- updateRoles         → bulk update
(1, 45,  9, NULL),  -- archiveRoles        → bulk archive
(1, 46,  2, NULL),  -- searchColors        → list
(1, 46,  3, NULL),  -- searchColors        → export
(1, 47,  2, NULL),  -- getColorHistory     → list
(1, 48,  7, NULL),  -- addColors           → bulk create
(1, 49,  5, NULL),  -- updateColors        → bulk update
(1, 50,  9, NULL),  -- archiveColors       → bulk archive
(1, 51,  2, NULL),  -- searchPermissions   → list
(1, 51,  3, NULL),  -- searchPermissions   → export
(1, 52,  7, NULL),  -- addPermissions      → bulk create
(1, 53,  5, NULL),  -- updatePermissions   → bulk update
(1, 54,  9, NULL),  -- deletePermissions   → bulk archive
(1, 55,  2, NULL),  -- getPreferences      → list
(1, 56, 12, NULL),  -- syncPreferences     → bulk sync
(1, 57,  1, NULL),  -- getBasicUserInfo    → read
(1, 58,  2, NULL),  -- getUserPreferences  → list
(1, 59, 12, NULL),  -- syncUserPreferences → bulk sync

-- ============================================================
-- Admin (2): no locked field on write operations
-- ============================================================
(2,  1,  4, NULL),  -- refreshToken
(2,  3,  8, NULL),  -- signOut
(2,  4,  2, NULL),  -- getConsumers
(2,  5,  9, NULL),  -- archiveConsumers
(2,  6,  2, NULL),  -- searchRoutes
(2,  7,  2, NULL),  -- getRouteHistory
(2,  8,  5, ARRAY['name', 'description', 'pattern', 'methods', 'isProtected']),  -- updateRoutes
(2,  9,  7, ARRAY['serviceId', 'resourceId', 'pattern', 'name', 'description', 'methods', 'isProtected']),  -- addRoutes
(2, 10,  9, NULL),  -- archiveRoutes
(2, 11,  2, NULL),  -- searchServices
(2, 12,  2, NULL),  -- getServiceHistory
(2, 13,  5, ARRAY['name', 'pattern']),  -- updateServices
(2, 14,  7, ARRAY['name', 'pattern']),  -- addServices
(2, 15,  9, NULL),  -- archiveServices
(2, 16,  2, NULL),  -- searchResources
(2, 17,  2, NULL),  -- getResourceHistory
(2, 18,  5, ARRAY['serviceId', 'name']),  -- updateResources
(2, 19,  7, ARRAY['serviceId', 'name']),  -- addResources
(2, 20,  9, NULL),  -- archiveResources
(2, 21,  2, NULL),  -- searchOperations
(2, 22,  2, NULL),  -- getOperationHistory
(2, 23,  5, ARRAY['name', 'description']),  -- updateOperations
(2, 24,  7, ARRAY['name', 'description']),  -- addOperations
(2, 25,  9, NULL),  -- archiveOperations
(2, 26,  2, NULL),  -- searchCors
(2, 27,  2, NULL),  -- getCorsHistory
(2, 28,  5, ARRAY['name']),  -- updateCors
(2, 29,  7, ARRAY['name']),  -- addCors
(2, 30,  9, NULL),  -- archiveCors
(2, 31,  2, NULL),  -- searchFields
(2, 32,  2, NULL),  -- getFieldHistory
(2, 33,  5, ARRAY['name']),  -- updateFields
(2, 34,  7, ARRAY['resourceId', 'name']),  -- addFields
(2, 35,  9, NULL),  -- archiveFields
(2, 36,  2, NULL),  -- searchScopes
(2, 37,  2, NULL),  -- getScopeHistory
(2, 38,  5, ARRAY['value']),  -- updateScopes
(2, 39,  7, ARRAY['value']),  -- addScopes
(2, 40,  9, NULL),  -- archiveScopes
(2, 41,  2, NULL),  -- searchRoles
(2, 42,  2, NULL),  -- getRoleHistory
(2, 43,  7, ARRAY['name', 'description', 'colorId']),  -- addRoles
(2, 44,  5, ARRAY['name', 'description', 'colorId']),  -- updateRoles
(2, 45,  9, NULL),  -- archiveRoles
(2, 46,  2, NULL),  -- searchColors
(2, 47,  2, NULL),  -- getColorHistory
(2, 48,  7, ARRAY['name', 'code']),  -- addColors
(2, 49,  5, ARRAY['name', 'code']),  -- updateColors
(2, 50,  9, NULL),  -- archiveColors
(2, 51,  2, NULL),  -- searchPermissions
(2, 52,  7, NULL),  -- addPermissions
(2, 53,  5, NULL),  -- updatePermissions
(2, 54,  9, NULL),  -- deletePermissions
(2, 55,  2, NULL),  -- getPreferences
(2, 56, 12, NULL),  -- syncPreferences
(2, 57,  1, NULL),  -- getBasicUserInfo
(2, 58,  2, NULL),  -- getUserPreferences
(2, 59, 12, NULL),  -- syncUserPreferences

-- ============================================================
-- User (3): read-only, public fields only
-- ============================================================
(3,  1,  4, NULL),  -- refreshToken
(3,  3,  8, NULL),  -- signOut
(3,  6,  2, ARRAY['id', 'serviceName', 'resourceName', 'url', 'name', 'description', 'methods']),  -- searchRoutes
(3, 11,  2, ARRAY['id', 'name', 'pattern']),  -- searchServices
(3, 16,  2, ARRAY['id', 'serviceName', 'name']),  -- searchResources
(3, 21,  2, ARRAY['id', 'name', 'description']),  -- searchOperations
(3, 26,  2, ARRAY['id', 'name']),  -- searchCors
(3, 31,  2, ARRAY['id', 'resourceId', 'name']),  -- searchFields
(3, 36,  2, ARRAY['id', 'value']),  -- searchScopes
(3, 41,  2, ARRAY['id', 'name', 'description', 'colorId', 'colorName']),  -- searchRoles
(3, 46,  2, ARRAY['id', 'name', 'code']),  -- searchColors
(3, 55,  2, NULL),  -- getPreferences
(3, 57,  1, NULL),  -- getBasicUserInfo
(3, 58,  2, NULL),  -- getUserPreferences
(3, 59, 12, NULL),  -- syncUserPreferences

-- ============================================================
-- Guest (4): session routes only
-- ============================================================
(4,  1,  4, NULL),  -- refreshToken
(4,  3,  8, NULL)   -- signOut

ON CONFLICT DO NOTHING;