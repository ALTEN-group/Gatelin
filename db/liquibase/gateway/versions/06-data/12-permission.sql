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
--   58=searchConditions  59=getConditionHistory  60=updateConditions  61=addConditions  62=archiveConditions
--   63=getPreferences   64=syncPreferences
--   65=getBasicUserInfo
--
-- Operation IDs (from 01-base.sql insertion order):
--   1=read  2=list  3=export  4=update  5=bulk update  6=create
--   7=bulk create  8=archive  9=bulk archive  10=delete  11=bulk delete  12=bulk sync
--
-- Role IDs (from 08-role.sql insertion order):
--   1=Super admin  2=Admin  3=User  4=Guest
--

INSERT INTO permissions ("roleId", "routeId", "operationId", fields, "conditionId", "creatorId", "creatorName") VALUES

-- ============================================================
-- Super admin (1): full access, no field restrictions
-- ============================================================
(1,  1,  4, NULL, NULL, -1, 'system'),  -- refreshToken        → update
(1,  3,  8, NULL, NULL, -1, 'system'),  -- signOut             → archive
(1,  4,  2, NULL, NULL, -1, 'system'),  -- getConsumers        → list
(1,  4,  3, NULL, NULL, -1, 'system'),  -- getConsumers        → export
(1,  5,  9, NULL, NULL, -1, 'system'),  -- archiveConsumers    → bulk archive
(1,  6,  2, NULL, NULL, -1, 'system'),  -- searchRoutes        → list
(1,  6,  3, NULL, NULL, -1, 'system'),  -- searchRoutes        → export
(1,  7,  2, NULL, NULL, -1, 'system'),  -- getRouteHistory     → list
(1,  8,  5, NULL, NULL, -1, 'system'),  -- updateRoutes        → bulk update
(1,  9,  7, NULL, NULL, -1, 'system'),  -- addRoutes           → bulk create
(1, 10,  9, NULL, NULL, -1, 'system'),  -- archiveRoutes       → bulk archive
(1, 11,  2, NULL, NULL, -1, 'system'),  -- searchServices      → list
(1, 11,  3, NULL, NULL, -1, 'system'),  -- searchServices      → export
(1, 12,  2, NULL, NULL, -1, 'system'),  -- getServiceHistory   → list
(1, 13,  5, NULL, NULL, -1, 'system'),  -- updateServices      → bulk update
(1, 14,  7, NULL, NULL, -1, 'system'),  -- addServices         → bulk create
(1, 15,  9, NULL, NULL, -1, 'system'),  -- archiveServices     → bulk archive
(1, 16,  2, NULL, NULL, -1, 'system'),  -- searchResources     → list
(1, 16,  3, NULL, NULL, -1, 'system'),  -- searchResources     → export
(1, 17,  2, NULL, NULL, -1, 'system'),  -- getResourceHistory  → list
(1, 18,  5, NULL, NULL, -1, 'system'),  -- updateResources     → bulk update
(1, 19,  7, NULL, NULL, -1, 'system'),  -- addResources        → bulk create
(1, 20,  9, NULL, NULL, -1, 'system'),  -- archiveResources    → bulk archive
(1, 21,  2, NULL, NULL, -1, 'system'),  -- searchOperations    → list
(1, 21,  3, NULL, NULL, -1, 'system'),  -- searchOperations    → export
(1, 22,  2, NULL, NULL, -1, 'system'),  -- getOperationHistory → list
(1, 23,  5, NULL, NULL, -1, 'system'),  -- updateOperations    → bulk update
(1, 24,  7, NULL, NULL, -1, 'system'),  -- addOperations       → bulk create
(1, 25,  9, NULL, NULL, -1, 'system'),  -- archiveOperations   → bulk archive
(1, 26,  2, NULL, NULL, -1, 'system'),  -- searchCors          → list
(1, 26,  3, NULL, NULL, -1, 'system'),  -- searchCors          → export
(1, 27,  2, NULL, NULL, -1, 'system'),  -- getCorsHistory      → list
(1, 28,  5, NULL, NULL, -1, 'system'),  -- updateCors          → bulk update
(1, 29,  7, NULL, NULL, -1, 'system'),  -- addCors             → bulk create
(1, 30,  9, NULL, NULL, -1, 'system'),  -- archiveCors         → bulk archive
(1, 31,  2, NULL, NULL, -1, 'system'),  -- searchFields        → list
(1, 31,  3, NULL, NULL, -1, 'system'),  -- searchFields        → export
(1, 32,  2, NULL, NULL, -1, 'system'),  -- getFieldHistory     → list
(1, 33,  5, NULL, NULL, -1, 'system'),  -- updateFields        → bulk update
(1, 34,  7, NULL, NULL, -1, 'system'),  -- addFields           → bulk create
(1, 35,  9, NULL, NULL, -1, 'system'),  -- archiveFields       → bulk archive
(1, 36,  2, NULL, NULL, -1, 'system'),  -- searchScopes        → list
(1, 36,  3, NULL, NULL, -1, 'system'),  -- searchScopes        → export
(1, 37,  2, NULL, NULL, -1, 'system'),  -- getScopeHistory     → list
(1, 38,  5, NULL, NULL, -1, 'system'),  -- updateScopes        → bulk update
(1, 39,  7, NULL, NULL, -1, 'system'),  -- addScopes           → bulk create
(1, 40,  9, NULL, NULL, -1, 'system'),  -- archiveScopes       → bulk archive
(1, 41,  2, NULL, NULL, -1, 'system'),  -- searchRoles         → list
(1, 41,  3, NULL, NULL, -1, 'system'),  -- searchRoles         → export
(1, 42,  2, NULL, NULL, -1, 'system'),  -- getRoleHistory      → list
(1, 43,  7, NULL, NULL, -1, 'system'),  -- addRoles            → bulk create
(1, 44,  5, NULL, NULL, -1, 'system'),  -- updateRoles         → bulk update
(1, 45,  9, NULL, NULL, -1, 'system'),  -- archiveRoles        → bulk archive
(1, 46,  2, NULL, NULL, -1, 'system'),  -- searchPermissions   → list
(1, 46,  3, NULL, NULL, -1, 'system'),  -- searchPermissions   → export
(1, 47,  2, NULL, NULL, -1, 'system'),  -- getPermissionHistory → list
(1, 48,  7, NULL, NULL, -1, 'system'),  -- addPermissions      → bulk create
(1, 49,  5, NULL, NULL, -1, 'system'),  -- updatePermissions   → bulk update
(1, 50,  9, NULL, NULL, -1, 'system'),  -- deletePermissions   → bulk archive
(1, 51,  2, NULL, NULL, -1, 'system'),  -- searchMethods       → list
(1, 51,  3, NULL, NULL, -1, 'system'),  -- searchMethods       → export
(1, 52,  5, NULL, NULL, -1, 'system'),  -- updateMethods       → bulk update
(1, 53,  2, NULL, NULL, -1, 'system'),  -- searchApplications  → list
(1, 53,  3, NULL, NULL, -1, 'system'),  -- searchApplications  → export
(1, 54,  2, NULL, NULL, -1, 'system'),  -- getApplicationHistory → list
(1, 55,  7, NULL, NULL, -1, 'system'),  -- addApplications     → bulk create
(1, 56,  5, NULL, NULL, -1, 'system'),  -- updateApplications  → bulk update
(1, 57,  9, NULL, NULL, -1, 'system'),  -- archiveApplications → bulk archive
(1, 58,  2, NULL, NULL, -1, 'system'),  -- searchConditions    → list
(1, 58,  3, NULL, NULL, -1, 'system'),  -- searchConditions    → export
(1, 59,  2, NULL, NULL, -1, 'system'),  -- getConditionHistory → list
(1, 60,  5, NULL, NULL, -1, 'system'),  -- updateConditions    → bulk update
(1, 61,  7, NULL, NULL, -1, 'system'),  -- addConditions       → bulk create
(1, 62,  9, NULL, NULL, -1, 'system'),  -- archiveConditions   → bulk archive
(1, 63,  2, NULL, NULL, -1, 'system'),  -- getPreferences      → list
(1, 64, 12, NULL, NULL, -1, 'system'),  -- syncPreferences     → bulk sync
(1, 65,  1, NULL, NULL, -1, 'system'),  -- getBasicUserInfo    → read

-- ============================================================
-- Admin (2): no locked field on write operations
-- ============================================================
(2,  1,  4, NULL, NULL, -1, 'system'),  -- refreshToken
(2,  3,  8, NULL, NULL, -1, 'system'),  -- signOut
(2,  4,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- getConsumers
(2,  5,  9, NULL, NULL, -1, 'system'),  -- archiveConsumers
(2,  6,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchRoutes
(2,  7,  2, NULL, NULL, -1, 'system'),  -- getRouteHistory
(2,  8,  5, ARRAY['name', 'description', 'pattern', 'methods', 'protected'], NULL, -1, 'system'),  -- updateRoutes
(2,  9,  7, ARRAY['serviceId', 'resourceId', 'pattern', 'name', 'description', 'methods', 'protected'], NULL, -1, 'system'),  -- addRoutes
(2, 10,  9, NULL, NULL, -1, 'system'),  -- archiveRoutes
(2, 11,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchServices
(2, 12,  2, NULL, NULL, -1, 'system'),  -- getServiceHistory
(2, 13,  5, ARRAY['name', 'pattern'], NULL, -1, 'system'),  -- updateServices
(2, 14,  7, ARRAY['name', 'pattern'], NULL, -1, 'system'),  -- addServices
(2, 15,  9, NULL, NULL, -1, 'system'),  -- archiveServices
(2, 16,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchResources
(2, 17,  2, NULL, NULL, -1, 'system'),  -- getResourceHistory
(2, 18,  5, ARRAY['serviceId', 'name'], NULL, -1, 'system'),  -- updateResources
(2, 19,  7, ARRAY['serviceId', 'name'], NULL, -1, 'system'),  -- addResources
(2, 20,  9, NULL, NULL, -1, 'system'),  -- archiveResources
(2, 21,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchOperations
(2, 22,  2, NULL, NULL, -1, 'system'),  -- getOperationHistory
(2, 23,  5, ARRAY['name', 'description'], NULL, -1, 'system'),  -- updateOperations
(2, 24,  7, ARRAY['name', 'description'], NULL, -1, 'system'),  -- addOperations
(2, 25,  9, NULL, NULL, -1, 'system'),  -- archiveOperations
(2, 26,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchCors
(2, 27,  2, NULL, NULL, -1, 'system'),  -- getCorsHistory
(2, 28,  5, ARRAY['name'], NULL, -1, 'system'),  -- updateCors
(2, 29,  7, ARRAY['name'], NULL, -1, 'system'),  -- addCors
(2, 30,  9, NULL, NULL, -1, 'system'),  -- archiveCors
(2, 31,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchFields
(2, 32,  2, NULL, NULL, -1, 'system'),  -- getFieldHistory
(2, 33,  5, ARRAY['name'], NULL, -1, 'system'),  -- updateFields
(2, 34,  7, ARRAY['resourceId', 'name'], NULL, -1, 'system'),  -- addFields
(2, 35,  9, NULL, NULL, -1, 'system'),  -- archiveFields
(2, 36,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchScopes
(2, 37,  2, NULL, NULL, -1, 'system'),  -- getScopeHistory
(2, 38,  5, ARRAY['value'], NULL, -1, 'system'),  -- updateScopes
(2, 39,  7, ARRAY['value'], NULL, -1, 'system'),  -- addScopes
(2, 40,  9, NULL, NULL, -1, 'system'),  -- archiveScopes
(2, 41,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchRoles
(2, 42,  2, NULL, NULL, -1, 'system'),  -- getRoleHistory
(2, 43,  7, ARRAY['name', 'description', 'color'], NULL, -1, 'system'),  -- addRoles
(2, 44,  5, ARRAY['name', 'description', 'color'], NULL, -1, 'system'),  -- updateRoles
(2, 45,  9, NULL, NULL, -1, 'system'),  -- archiveRoles
(2, 46,  2, NULL, NULL, -1, 'system'),  -- searchPermissions
(2, 47,  2, NULL, NULL, -1, 'system'),  -- getPermissionHistory
(2, 48,  7, NULL, NULL, -1, 'system'),  -- addPermissions
(2, 49,  5, NULL, NULL, -1, 'system'),  -- updatePermissions
(2, 50,  9, NULL, NULL, -1, 'system'),  -- deletePermissions
(2, 51,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchMethods → list
(2, 51,  3, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchMethods → export
(2, 52,  5, ARRAY['name', 'color'], NULL, -1, 'system'),  -- updateMethods
(2, 53,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchApplications → list
(2, 53,  3, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchApplications → export
(2, 54,  2, NULL, NULL, -1, 'system'),  -- getApplicationHistory
(2, 55,  7, ARRAY['name', 'url', 'appId'], NULL, -1, 'system'),  -- addApplications
(2, 56,  5, ARRAY['name', 'url', 'appId'], NULL, -1, 'system'),  -- updateApplications
(2, 57,  9, NULL, NULL, -1, 'system'),  -- archiveApplications
(2, 58,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchConditions → list
(2, 58,  3, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchConditions → export
(2, 59,  2, NULL, NULL, -1, 'system'),  -- getConditionHistory
(2, 60,  5, ARRAY['name', 'fieldId', 'op', 'value'], NULL, -1, 'system'),  -- updateConditions
(2, 61,  7, ARRAY['name', 'fieldId', 'op', 'value'], NULL, -1, 'system'),  -- addConditions
(2, 62,  9, NULL, NULL, -1, 'system'),  -- archiveConditions
(2, 63,  2, NULL, NULL, -1, 'system'),  -- getPreferences
(2, 64, 12, NULL, NULL, -1, 'system'),  -- syncPreferences
(2, 65,  1, NULL, NULL, -1, 'system'),  -- getBasicUserInfo

-- ============================================================
-- User (3): read-only, public fields only
-- ============================================================
(3,  1,  4, NULL, NULL, -1, 'system'),  -- refreshToken
(3,  3,  8, NULL, NULL, -1, 'system'),  -- signOut
(3,  6,  2, ARRAY['id', 'serviceName', 'resourceName', 'url', 'name', 'description', 'methods'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchRoutes
(3, 11,  2, ARRAY['id', 'name', 'pattern'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchServices
(3, 16,  2, ARRAY['id', 'serviceName', 'name'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchResources
(3, 21,  2, ARRAY['id', 'name', 'description'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchOperations
(3, 26,  2, ARRAY['id', 'name'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchCors
(3, 31,  2, ARRAY['id', 'resourceId', 'name'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchFields
(3, 36,  2, ARRAY['id', 'value'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchScopes
(3, 41,  2, ARRAY['id', 'name', 'description', 'color'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchRoles
(3, 63,  2, NULL, NULL, -1, 'system'),  -- getPreferences
(3, 65,  1, NULL, NULL, -1, 'system'),  -- getBasicUserInfo

-- ============================================================
-- Guest (4): session routes only
-- ============================================================
(4,  1,  4, NULL, NULL, -1, 'system'),  -- refreshToken
(4,  3,  8, NULL, NULL, -1, 'system')   -- signOut
;