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
--   46=searchPermissions 47=getPermissionHistory 48=addPermissions 49=updatePermissions 50=deletePermissions
--   51=searchMethods    52=updateMethods
--   53=searchApplications 54=getApplicationHistory 55=addApplications 56=updateApplications 57=archiveApplications
--   58=getPreferences   59=syncPreferences
--   60=getBasicUserInfo
--
-- Operation IDs (from 01-base.sql insertion order):
--   1=read  2=list  3=export  4=update  5=bulk update  6=create
--   7=bulk create  8=archive  9=bulk archive  10=delete  11=bulk delete  12=bulk sync
--
-- Role IDs (from 08-role.sql insertion order):
--   1=Super admin  2=Admin  3=User  4=Guest
--

INSERT INTO permissions ("roleId", "routeId", "operationId", fields, conditions, "creatorId", "creatorName") VALUES

-- ============================================================
-- Super admin (1): full access, no field restrictions
-- ============================================================
(1,  1,  ARRAY[4], NULL, NULL, -1, 'system'),  -- refreshToken        → update
(1,  3,  ARRAY[8], NULL, NULL, -1, 'system'),  -- signOut             → archive
(1,  4,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getConsumers        → list
(1,  5,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveConsumers    → bulk archive
(1,  6,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchRoutes        → list
(1,  7,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getRouteHistory     → list
(1,  8,  ARRAY[5], NULL, NULL, -1, 'system'),  -- updateRoutes        → bulk update
(1,  9,  ARRAY[7], NULL, NULL, -1, 'system'),  -- addRoutes           → bulk create
(1, 10,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveRoutes       → bulk archive
(1, 11,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchServices      → list
(1, 12,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getServiceHistory   → list
(1, 13,  ARRAY[5], NULL, NULL, -1, 'system'),  -- updateServices      → bulk update
(1, 14,  ARRAY[7], NULL, NULL, -1, 'system'),  -- addServices         → bulk create
(1, 15,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveServices     → bulk archive
(1, 16,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchResources     → list
(1, 17,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getResourceHistory  → list
(1, 18,  ARRAY[5], NULL, NULL, -1, 'system'),  -- updateResources     → bulk update
(1, 19,  ARRAY[7], NULL, NULL, -1, 'system'),  -- addResources        → bulk create
(1, 20,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveResources    → bulk archive
(1, 21,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchOperations    → list
(1, 22,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getOperationHistory → list
(1, 23,  ARRAY[5], NULL, NULL, -1, 'system'),  -- updateOperations    → bulk update
(1, 24,  ARRAY[7], NULL, NULL, -1, 'system'),  -- addOperations       → bulk create
(1, 25,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveOperations   → bulk archive
(1, 26,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchCors          → list
(1, 27,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getCorsHistory      → list
(1, 28,  ARRAY[5], NULL, NULL, -1, 'system'),  -- updateCors          → bulk update
(1, 29,  ARRAY[7], NULL, NULL, -1, 'system'),  -- addCors             → bulk create
(1, 30,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveCors         → bulk archive
(1, 31,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchFields        → list
(1, 32,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getFieldHistory     → list
(1, 33,  ARRAY[5], NULL, NULL, -1, 'system'),  -- updateFields        → bulk update
(1, 34,  ARRAY[7], NULL, NULL, -1, 'system'),  -- addFields           → bulk create
(1, 35,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveFields       → bulk archive
(1, 36,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchScopes        → list
(1, 37,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getScopeHistory     → list
(1, 38,  ARRAY[5], NULL, NULL, -1, 'system'),  -- updateScopes        → bulk update
(1, 39,  ARRAY[7], NULL, NULL, -1, 'system'),  -- addScopes           → bulk create
(1, 40,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveScopes       → bulk archive
(1, 41,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchRoles         → list
(1, 42,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getRoleHistory      → list
(1, 43,  ARRAY[7], NULL, NULL, -1, 'system'),  -- addRoles            → bulk create
(1, 44,  ARRAY[5], NULL, NULL, -1, 'system'),  -- updateRoles         → bulk update
(1, 45,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveRoles        → bulk archive
(1, 46,  ARRAY[2,3], NULL, NULL, -1, 'system'), -- searchPermissions  → list + export
(1, 47,  ARRAY[2], NULL, NULL, -1, 'system'),   -- getPermissionHistory → list
(1, 48,  ARRAY[7], NULL, NULL, -1, 'system'),   -- addPermissions      → bulk create
(1, 49,  ARRAY[5], NULL, NULL, -1, 'system'),   -- updatePermissions   → bulk update
(1, 50,  ARRAY[9], NULL, NULL, -1, 'system'),   -- deletePermissions   → bulk archive
(1, 51,  ARRAY[2,3], NULL, NULL, -1, 'system'), -- searchMethods           → list + export
(1, 52,  ARRAY[5], NULL, NULL, -1, 'system'),   -- updateMethods           → bulk update
(1, 53,  ARRAY[2,3], NULL, NULL, -1, 'system'), -- searchApplications     → list + export
(1, 54,  ARRAY[2], NULL, NULL, -1, 'system'),   -- getApplicationHistory   → list
(1, 55,  ARRAY[7], NULL, NULL, -1, 'system'),   -- addApplications         → bulk create
(1, 56,  ARRAY[5], NULL, NULL, -1, 'system'),   -- updateApplications      → bulk update
(1, 57,  ARRAY[9], NULL, NULL, -1, 'system'),   -- archiveApplications     → bulk archive
(1, 58,  ARRAY[2], NULL, NULL, -1, 'system'),   -- getPreferences          → list
(1, 59,  ARRAY[12], NULL, NULL, -1, 'system'),  -- syncPreferences         → bulk sync
(1, 60,  ARRAY[1], NULL, NULL, -1, 'system'),   -- getBasicUserInfo        → read

-- ============================================================
-- Admin (2): no locked field on write operations
-- ============================================================
(2,  1,  ARRAY[4], NULL, NULL, -1, 'system'),  -- refreshToken
(2,  3,  ARRAY[8], NULL, NULL, -1, 'system'),  -- signOut
(2,  4,  ARRAY[2], NULL, '[{"field": "archived", "op": "=", "value": "false"}]'::json, -1, 'system'),  -- getConsumers → non-archived only
(2,  5,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveConsumers
(2,  6,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchRoutes
(2,  7,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getRouteHistory
(2,  8,  ARRAY[5], ARRAY['name', 'description', 'pattern', 'methods', 'protected'], NULL, -1, 'system'),  -- updateRoutes
(2,  9,  ARRAY[7], ARRAY['serviceId', 'resourceId', 'pattern', 'name', 'description', 'methods', 'protected'], NULL, -1, 'system'),  -- addRoutes
(2, 10,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveRoutes
(2, 11,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchServices
(2, 12,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getServiceHistory
(2, 13,  ARRAY[5], ARRAY['name', 'pattern'], NULL, -1, 'system'),  -- updateServices
(2, 14,  ARRAY[7], ARRAY['name', 'pattern'], NULL, -1, 'system'),  -- addServices
(2, 15,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveServices
(2, 16,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchResources
(2, 17,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getResourceHistory
(2, 18,  ARRAY[5], ARRAY['serviceId', 'name'], NULL, -1, 'system'),  -- updateResources
(2, 19,  ARRAY[7], ARRAY['serviceId', 'name'], NULL, -1, 'system'),  -- addResources
(2, 20,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveResources
(2, 21,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchOperations
(2, 22,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getOperationHistory
(2, 23,  ARRAY[5], ARRAY['name', 'description'], NULL, -1, 'system'),  -- updateOperations
(2, 24,  ARRAY[7], ARRAY['name', 'description'], NULL, -1, 'system'),  -- addOperations
(2, 25,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveOperations
(2, 26,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchCors
(2, 27,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getCorsHistory
(2, 28,  ARRAY[5], ARRAY['name'], NULL, -1, 'system'),  -- updateCors
(2, 29,  ARRAY[7], ARRAY['name'], NULL, -1, 'system'),  -- addCors
(2, 30,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveCors
(2, 31,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchFields
(2, 32,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getFieldHistory
(2, 33,  ARRAY[5], ARRAY['name'], NULL, -1, 'system'),  -- updateFields
(2, 34,  ARRAY[7], ARRAY['resourceId', 'name'], NULL, -1, 'system'),  -- addFields
(2, 35,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveFields
(2, 36,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchScopes
(2, 37,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getScopeHistory
(2, 38,  ARRAY[5], ARRAY['value'], NULL, -1, 'system'),  -- updateScopes
(2, 39,  ARRAY[7], ARRAY['value'], NULL, -1, 'system'),  -- addScopes
(2, 40,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveScopes
(2, 41,  ARRAY[2], NULL, NULL, -1, 'system'),  -- searchRoles
(2, 42,  ARRAY[2], NULL, NULL, -1, 'system'),  -- getRoleHistory
(2, 43,  ARRAY[7], ARRAY['name', 'description', 'color'], NULL, -1, 'system'),  -- addRoles
(2, 44,  ARRAY[5], ARRAY['name', 'description', 'color'], NULL, -1, 'system'),  -- updateRoles
(2, 45,  ARRAY[9], NULL, NULL, -1, 'system'),  -- archiveRoles
(2, 46,  ARRAY[2], NULL, NULL, -1, 'system'),   -- searchPermissions
(2, 47,  ARRAY[2], NULL, NULL, -1, 'system'),   -- getPermissionHistory
(2, 48,  ARRAY[7], NULL, NULL, -1, 'system'),   -- addPermissions
(2, 49,  ARRAY[5], NULL, NULL, -1, 'system'),   -- updatePermissions
(2, 50,  ARRAY[9], NULL, NULL, -1, 'system'),   -- deletePermissions
(2, 51,  ARRAY[2,3], NULL, NULL, -1, 'system'), -- searchMethods
(2, 52,  ARRAY[5], ARRAY['name', 'color'], NULL, -1, 'system'),  -- updateMethods
(2, 53,  ARRAY[2,3], NULL, NULL, -1, 'system'), -- searchApplications
(2, 54,  ARRAY[2], NULL, NULL, -1, 'system'),   -- getApplicationHistory
(2, 55,  ARRAY[7], ARRAY['name', 'url', 'appId'], NULL, -1, 'system'),  -- addApplications
(2, 56,  ARRAY[5], ARRAY['name', 'url', 'appId'], NULL, -1, 'system'),  -- updateApplications
(2, 57,  ARRAY[9], NULL, NULL, -1, 'system'),   -- archiveApplications
(2, 58,  ARRAY[2], NULL, NULL, -1, 'system'),   -- getPreferences
(2, 59,  ARRAY[12], NULL, NULL, -1, 'system'),  -- syncPreferences
(2, 60,  ARRAY[1], NULL, NULL, -1, 'system'),   -- getBasicUserInfo

-- ============================================================
-- User (3): read-only, public fields only
-- ============================================================
(3,  1,  ARRAY[4], NULL, NULL, -1, 'system'),  -- refreshToken
(3,  3,  ARRAY[8], NULL, NULL, -1, 'system'),  -- signOut
(3,  6,  ARRAY[2], ARRAY['id', 'serviceName', 'resourceName', 'url', 'name', 'description', 'methods'], NULL, -1, 'system'),  -- searchRoutes
(3, 11,  ARRAY[2], ARRAY['id', 'name', 'pattern'], NULL, -1, 'system'),  -- searchServices
(3, 16,  ARRAY[2], ARRAY['id', 'serviceName', 'name'], NULL, -1, 'system'),  -- searchResources
(3, 21,  ARRAY[2], ARRAY['id', 'name', 'description'], NULL, -1, 'system'),  -- searchOperations
(3, 26,  ARRAY[2], ARRAY['id', 'name'], NULL, -1, 'system'),  -- searchCors
(3, 31,  ARRAY[2], ARRAY['id', 'resourceId', 'name'], NULL, -1, 'system'),  -- searchFields
(3, 36,  ARRAY[2], ARRAY['id', 'value'], NULL, -1, 'system'),  -- searchScopes
(3, 41,  ARRAY[2], ARRAY['id', 'name', 'description', 'color'], NULL, -1, 'system'),  -- searchRoles
(3, 58,  ARRAY[2], NULL, '[{"field": "consumerId", "op": "=", "value": "$consumerId"}]'::json, -1, 'system'),  -- getPreferences → own only
(3, 60,  ARRAY[1], NULL, '[{"field": "id",         "op": "=", "value": "$consumerId"}]'::json, -1, 'system'),  -- getBasicUserInfo → own only

-- ============================================================
-- Guest (4): session routes only
-- ============================================================
(4,  1,  ARRAY[4], NULL, NULL, -1, 'system'),  -- refreshToken
(4,  3,  ARRAY[8], NULL, NULL, -1, 'system')   -- signOut
;