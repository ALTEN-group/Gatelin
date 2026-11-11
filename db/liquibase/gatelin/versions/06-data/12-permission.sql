--
-- Default permission data — derived from ms_role mock
--
-- Route IDs (from 06-route.sql insertion order):
--   1=refreshToken      2=signIn            3=signOut
--   4=getConsumers      5=archiveConsumers
--   6=searchRoutes      7=getRouteHistory   8=updateRoutes      9=addRoutes         10=archiveRoutes     11=restoreRoutes
--   12=searchServices   13=getServiceHistory 14=updateServices  15=addServices      16=archiveServices   17=restoreServices
--   18=searchResources  19=getResourceHistory 20=updateResources 21=addResources    22=archiveResources  23=restoreResources
--   24=searchOperations 25=getOperationHistory 26=updateOperations 27=addOperations 28=archiveOperations 29=restoreOperations
--   30=searchCors       31=getCorsHistory   32=updateCors       33=addCors          34=archiveCors       35=restoreCors
--   36=searchFields     37=getFieldHistory  38=updateFields     39=addFields        40=archiveFields     41=restoreFields
--   42=searchScopes     43=getScopeHistory  44=updateScopes     45=addScopes        46=archiveScopes     47=restoreScopes
--   48=searchRoles      49=getRoleHistory   50=addRoles         51=updateRoles      52=archiveRoles      53=restoreRoles
--   54=searchPermissions 55=getPermissionHistory 56=addPermissions 57=updatePermissions 58=deletePermissions
--   59=searchMethods    60=updateMethods
--   61=searchApplications 62=getApplicationHistory 63=addApplications 64=updateApplications 65=archiveApplications 66=restoreApplications
--   67=searchConditions  68=getConditionHistory  69=updateConditions  70=addConditions  71=archiveConditions  72=restoreConditions
--   73=getPreferences   74=addPreferences   75=updatePreferences   76=deletePreference
--   77=getConsumerSchema    78=getRouteSchema       79=getServiceSchema     80=getResourceSchema
--   81=getOperationSchema   82=getCorsSchema        83=getFieldSchema       84=getScopeSchema
--   85=getRoleSchema        86=getPermissionSchema  87=getMethodSchema      88=getApplicationSchema
--   89=getConditionSchema
--   90=resumeSignIn (public; no permission row — appended after the original seed)
--
-- Operation IDs (from 03-operation.sql insertion order):
--   1=read  2=list  3=export  4=update  5=bulk update  6=create
--   7=bulk create  8=archive  9=bulk archive  10=delete  11=bulk delete  12=bulk sync
--   13=execute  14=restore  15=bulk restore
--
-- Role IDs (from 08-role.sql insertion order):
--   1=Super admin  2=Admin  3=User  4=Guest
--

INSERT INTO permissions ("roleId", "routeId", "operationId", fields, "conditionId", "creatorId", "creatorName") VALUES

-- ============================================================
-- Super admin (1): full access, no field restrictions
-- ============================================================
(1,  1,  4, NULL, NULL, -1, 'system'),  -- refreshToken          → update
(1,  3,  8, NULL, NULL, -1, 'system'),  -- signOut               → archive
(1,  4,  2, NULL, NULL, -1, 'system'),  -- getConsumers          → list
(1,  4,  3, NULL, NULL, -1, 'system'),  -- getConsumers          → export
(1,  5,  9, NULL, NULL, -1, 'system'),  -- archiveConsumers      → bulk archive
(1,  6,  2, NULL, NULL, -1, 'system'),  -- searchRoutes          → list
(1,  6,  3, NULL, NULL, -1, 'system'),  -- searchRoutes          → export
(1,  7,  2, NULL, NULL, -1, 'system'),  -- getRouteHistory       → list
(1,  8,  5, NULL, NULL, -1, 'system'),  -- updateRoutes          → bulk update
(1,  9,  7, NULL, NULL, -1, 'system'),  -- addRoutes             → bulk create
(1, 10,  9, NULL, NULL, -1, 'system'),  -- archiveRoutes         → bulk archive
(1, 11, 15, NULL, NULL, -1, 'system'),  -- restoreRoutes         → bulk restore
(1, 12,  2, NULL, NULL, -1, 'system'),  -- searchServices        → list
(1, 12,  3, NULL, NULL, -1, 'system'),  -- searchServices        → export
(1, 13,  2, NULL, NULL, -1, 'system'),  -- getServiceHistory     → list
(1, 14,  5, NULL, NULL, -1, 'system'),  -- updateServices        → bulk update
(1, 15,  7, NULL, NULL, -1, 'system'),  -- addServices           → bulk create
(1, 16,  9, NULL, NULL, -1, 'system'),  -- archiveServices       → bulk archive
(1, 17, 15, NULL, NULL, -1, 'system'),  -- restoreServices       → bulk restore
(1, 18,  2, NULL, NULL, -1, 'system'),  -- searchResources       → list
(1, 18,  3, NULL, NULL, -1, 'system'),  -- searchResources       → export
(1, 19,  2, NULL, NULL, -1, 'system'),  -- getResourceHistory    → list
(1, 20,  5, NULL, NULL, -1, 'system'),  -- updateResources       → bulk update
(1, 21,  7, NULL, NULL, -1, 'system'),  -- addResources          → bulk create
(1, 22,  9, NULL, NULL, -1, 'system'),  -- archiveResources      → bulk archive
(1, 23, 15, NULL, NULL, -1, 'system'),  -- restoreResources      → bulk restore
(1, 24,  2, NULL, NULL, -1, 'system'),  -- searchOperations      → list
(1, 24,  3, NULL, NULL, -1, 'system'),  -- searchOperations      → export
(1, 25,  2, NULL, NULL, -1, 'system'),  -- getOperationHistory   → list
(1, 26,  5, NULL, NULL, -1, 'system'),  -- updateOperations      → bulk update
(1, 27,  7, NULL, NULL, -1, 'system'),  -- addOperations         → bulk create
(1, 28,  9, NULL, NULL, -1, 'system'),  -- archiveOperations     → bulk archive
(1, 29, 15, NULL, NULL, -1, 'system'),  -- restoreOperations     → bulk restore
(1, 30,  2, NULL, NULL, -1, 'system'),  -- searchCors            → list
(1, 30,  3, NULL, NULL, -1, 'system'),  -- searchCors            → export
(1, 31,  2, NULL, NULL, -1, 'system'),  -- getCorsHistory        → list
(1, 32,  5, NULL, NULL, -1, 'system'),  -- updateCors            → bulk update
(1, 33,  7, NULL, NULL, -1, 'system'),  -- addCors               → bulk create
(1, 34,  9, NULL, NULL, -1, 'system'),  -- archiveCors           → bulk archive
(1, 35, 15, NULL, NULL, -1, 'system'),  -- restoreCors           → bulk restore
(1, 36,  2, NULL, NULL, -1, 'system'),  -- searchFields          → list
(1, 36,  3, NULL, NULL, -1, 'system'),  -- searchFields          → export
(1, 37,  2, NULL, NULL, -1, 'system'),  -- getFieldHistory       → list
(1, 38,  5, NULL, NULL, -1, 'system'),  -- updateFields          → bulk update
(1, 39,  7, NULL, NULL, -1, 'system'),  -- addFields             → bulk create
(1, 40,  9, NULL, NULL, -1, 'system'),  -- archiveFields         → bulk archive
(1, 41, 15, NULL, NULL, -1, 'system'),  -- restoreFields         → bulk restore
(1, 42,  2, NULL, NULL, -1, 'system'),  -- searchScopes          → list
(1, 42,  3, NULL, NULL, -1, 'system'),  -- searchScopes          → export
(1, 43,  2, NULL, NULL, -1, 'system'),  -- getScopeHistory       → list
(1, 44,  5, NULL, NULL, -1, 'system'),  -- updateScopes          → bulk update
(1, 45,  7, NULL, NULL, -1, 'system'),  -- addScopes             → bulk create
(1, 46,  9, NULL, NULL, -1, 'system'),  -- archiveScopes         → bulk archive
(1, 47, 15, NULL, NULL, -1, 'system'),  -- restoreScopes         → bulk restore
(1, 48,  2, NULL, NULL, -1, 'system'),  -- searchRoles           → list
(1, 48,  3, NULL, NULL, -1, 'system'),  -- searchRoles           → export
(1, 49,  2, NULL, NULL, -1, 'system'),  -- getRoleHistory        → list
(1, 50,  7, NULL, NULL, -1, 'system'),  -- addRoles              → bulk create
(1, 51,  5, NULL, NULL, -1, 'system'),  -- updateRoles           → bulk update
(1, 52,  9, NULL, NULL, -1, 'system'),  -- archiveRoles          → bulk archive
(1, 53, 15, NULL, NULL, -1, 'system'),  -- restoreRoles          → bulk restore
(1, 54,  2, NULL, NULL, -1, 'system'),  -- searchPermissions     → list
(1, 54,  3, NULL, NULL, -1, 'system'),  -- searchPermissions     → export
(1, 55,  2, NULL, NULL, -1, 'system'),  -- getPermissionHistory  → list
(1, 56,  7, NULL, NULL, -1, 'system'),  -- addPermissions        → bulk create
(1, 57,  5, NULL, NULL, -1, 'system'),  -- updatePermissions     → bulk update
(1, 58, 11, NULL, NULL, -1, 'system'),  -- deletePermissions     → bulk delete
(1, 59,  2, NULL, NULL, -1, 'system'),  -- searchMethods         → list
(1, 59,  3, NULL, NULL, -1, 'system'),  -- searchMethods         → export
(1, 60,  5, NULL, NULL, -1, 'system'),  -- updateMethods         → bulk update
(1, 61,  2, NULL, NULL, -1, 'system'),  -- searchApplications    → list
(1, 61,  3, NULL, NULL, -1, 'system'),  -- searchApplications    → export
(1, 62,  2, NULL, NULL, -1, 'system'),  -- getApplicationHistory → list
(1, 63,  7, NULL, NULL, -1, 'system'),  -- addApplications       → bulk create
(1, 64,  5, NULL, NULL, -1, 'system'),  -- updateApplications    → bulk update
(1, 65,  9, NULL, NULL, -1, 'system'),  -- archiveApplications   → bulk archive
(1, 66, 15, NULL, NULL, -1, 'system'),  -- restoreApplications   → bulk restore
(1, 67,  2, NULL, NULL, -1, 'system'),  -- searchConditions      → list
(1, 67,  3, NULL, NULL, -1, 'system'),  -- searchConditions      → export
(1, 68,  2, NULL, NULL, -1, 'system'),  -- getConditionHistory   → list
(1, 69,  5, NULL, NULL, -1, 'system'),  -- updateConditions      → bulk update
(1, 70,  7, NULL, NULL, -1, 'system'),  -- addConditions         → bulk create
(1, 71,  9, NULL, NULL, -1, 'system'),  -- archiveConditions     → bulk archive
(1, 72, 15, NULL, NULL, -1, 'system'),  -- restoreConditions     → bulk restore
(1, 73,  2, NULL, NULL, -1, 'system'),  -- getPreferences        → list
(1, 74,  6, NULL, NULL, -1, 'system'),  -- addPreferences        → create
(1, 75,  5, NULL, NULL, -1, 'system'),  -- updatePreferences     → bulk update
(1, 76, 10, NULL, NULL, -1, 'system'),  -- deletePreference      → delete
(1, 77,  2, NULL, NULL, -1, 'system'),  -- getConsumerSchema     → list
(1, 78,  2, NULL, NULL, -1, 'system'),  -- getRouteSchema        → list
(1, 79,  2, NULL, NULL, -1, 'system'),  -- getServiceSchema      → list
(1, 80,  2, NULL, NULL, -1, 'system'),  -- getResourceSchema     → list
(1, 81,  2, NULL, NULL, -1, 'system'),  -- getOperationSchema    → list
(1, 82,  2, NULL, NULL, -1, 'system'),  -- getCorsSchema         → list
(1, 83,  2, NULL, NULL, -1, 'system'),  -- getFieldSchema        → list
(1, 84,  2, NULL, NULL, -1, 'system'),  -- getScopeSchema        → list
(1, 85,  2, NULL, NULL, -1, 'system'),  -- getRoleSchema         → list
(1, 86,  2, NULL, NULL, -1, 'system'),  -- getPermissionSchema   → list
(1, 87,  2, NULL, NULL, -1, 'system'),  -- getMethodSchema       → list
(1, 88,  2, NULL, NULL, -1, 'system'),  -- getApplicationSchema  → list
(1, 89,  2, NULL, NULL, -1, 'system'),  -- getConditionSchema    → list

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
(2, 11, 15, NULL, NULL, -1, 'system'),  -- restoreRoutes
(2, 12,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchServices
(2, 13,  2, NULL, NULL, -1, 'system'),  -- getServiceHistory
(2, 14,  5, ARRAY['name', 'pattern'], NULL, -1, 'system'),  -- updateServices
(2, 15,  7, ARRAY['name', 'pattern'], NULL, -1, 'system'),  -- addServices
(2, 16,  9, NULL, NULL, -1, 'system'),  -- archiveServices
(2, 17, 15, NULL, NULL, -1, 'system'),  -- restoreServices
(2, 18,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchResources
(2, 19,  2, NULL, NULL, -1, 'system'),  -- getResourceHistory
(2, 20,  5, ARRAY['serviceId', 'name'], NULL, -1, 'system'),  -- updateResources
(2, 21,  7, ARRAY['serviceId', 'name'], NULL, -1, 'system'),  -- addResources
(2, 22,  9, NULL, NULL, -1, 'system'),  -- archiveResources
(2, 23, 15, NULL, NULL, -1, 'system'),  -- restoreResources
(2, 24,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchOperations
(2, 25,  2, NULL, NULL, -1, 'system'),  -- getOperationHistory
(2, 26,  5, NULL, NULL, -1, 'system'),  -- updateOperations
(2, 27,  7, ARRAY['name', 'description'], NULL, -1, 'system'),  -- addOperations
(2, 28,  9, NULL, NULL, -1, 'system'),  -- archiveOperations
(2, 29, 15, NULL, NULL, -1, 'system'),  -- restoreOperations
(2, 30,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchCors
(2, 31,  2, NULL, NULL, -1, 'system'),  -- getCorsHistory
(2, 32,  5, ARRAY['name'], NULL, -1, 'system'),  -- updateCors
(2, 33,  7, ARRAY['name'], NULL, -1, 'system'),  -- addCors
(2, 34,  9, NULL, NULL, -1, 'system'),  -- archiveCors
(2, 35, 15, NULL, NULL, -1, 'system'),  -- restoreCors
(2, 36,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchFields
(2, 37,  2, NULL, NULL, -1, 'system'),  -- getFieldHistory
(2, 38,  5, ARRAY['name'], NULL, -1, 'system'),  -- updateFields
(2, 39,  7, ARRAY['resourceId', 'name'], NULL, -1, 'system'),  -- addFields
(2, 40,  9, NULL, NULL, -1, 'system'),  -- archiveFields
(2, 41, 15, NULL, NULL, -1, 'system'),  -- restoreFields
(2, 42,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchScopes
(2, 43,  2, NULL, NULL, -1, 'system'),  -- getScopeHistory
(2, 44,  5, ARRAY['value'], NULL, -1, 'system'),  -- updateScopes
(2, 45,  7, ARRAY['value'], NULL, -1, 'system'),  -- addScopes
(2, 46,  9, NULL, NULL, -1, 'system'),  -- archiveScopes
(2, 47, 15, NULL, NULL, -1, 'system'),  -- restoreScopes
(2, 48,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchRoles
(2, 49,  2, NULL, NULL, -1, 'system'),  -- getRoleHistory
(2, 50,  7, ARRAY['name', 'description', 'color'], NULL, -1, 'system'),  -- addRoles
(2, 51,  5, ARRAY['name', 'description', 'color'], NULL, -1, 'system'),  -- updateRoles
(2, 52,  9, NULL, NULL, -1, 'system'),  -- archiveRoles
(2, 53, 15, NULL, NULL, -1, 'system'),  -- restoreRoles
(2, 54,  2, NULL, NULL, -1, 'system'),  -- searchPermissions
(2, 55,  2, NULL, NULL, -1, 'system'),  -- getPermissionHistory
(2, 56,  7, NULL, NULL, -1, 'system'),  -- addPermissions
(2, 57,  5, NULL, NULL, -1, 'system'),  -- updatePermissions
(2, 58, 11, NULL, NULL, -1, 'system'),  -- deletePermissions
(2, 59,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchMethods → list
(2, 59,  3, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchMethods → export
(2, 60,  5, ARRAY['name'], NULL, -1, 'system'),  -- updateMethods
(2, 61,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchApplications → list
(2, 61,  3, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchApplications → export
(2, 62,  2, NULL, NULL, -1, 'system'),  -- getApplicationHistory
(2, 63,  7, ARRAY['name', 'url', 'appId'], NULL, -1, 'system'),  -- addApplications
(2, 64,  5, ARRAY['name', 'url', 'appId'], NULL, -1, 'system'),  -- updateApplications
(2, 65,  9, NULL, NULL, -1, 'system'),  -- archiveApplications
(2, 66, 15, NULL, NULL, -1, 'system'),  -- restoreApplications
(2, 67,  2, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchConditions → list
(2, 67,  3, NULL, (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchConditions → export
(2, 68,  2, NULL, NULL, -1, 'system'),  -- getConditionHistory
(2, 69,  5, ARRAY['name', 'fieldId', 'op', 'value'], NULL, -1, 'system'),  -- updateConditions
(2, 70,  7, ARRAY['name', 'fieldId', 'op', 'value'], NULL, -1, 'system'),  -- addConditions
(2, 71,  9, NULL, NULL, -1, 'system'),  -- archiveConditions
(2, 72, 15, NULL, NULL, -1, 'system'),  -- restoreConditions
(2, 73,  2, NULL, NULL, -1, 'system'),  -- getPreferences
(2, 74,  6, NULL, NULL, -1, 'system'),  -- addPreferences
(2, 75,  5, NULL, NULL, -1, 'system'),  -- updatePreferences
(2, 76, 10, NULL, NULL, -1, 'system'),  -- deletePreference
(2, 77,  2, NULL, NULL, -1, 'system'),  -- getConsumerSchema     → list
(2, 78,  2, NULL, NULL, -1, 'system'),  -- getRouteSchema        → list
(2, 79,  2, NULL, NULL, -1, 'system'),  -- getServiceSchema      → list
(2, 80,  2, NULL, NULL, -1, 'system'),  -- getResourceSchema     → list
(2, 81,  2, NULL, NULL, -1, 'system'),  -- getOperationSchema    → list
(2, 82,  2, NULL, NULL, -1, 'system'),  -- getCorsSchema         → list
(2, 83,  2, NULL, NULL, -1, 'system'),  -- getFieldSchema        → list
(2, 84,  2, NULL, NULL, -1, 'system'),  -- getScopeSchema        → list
(2, 85,  2, NULL, NULL, -1, 'system'),  -- getRoleSchema         → list
(2, 86,  2, NULL, NULL, -1, 'system'),  -- getPermissionSchema   → list
(2, 87,  2, NULL, NULL, -1, 'system'),  -- getMethodSchema       → list
(2, 88,  2, NULL, NULL, -1, 'system'),  -- getApplicationSchema  → list
(2, 89,  2, NULL, NULL, -1, 'system'),  -- getConditionSchema    → list

-- ============================================================
-- User (3): read-only, public fields only
-- ============================================================
(3,  1,  4, NULL, NULL, -1, 'system'),  -- refreshToken
(3,  3,  8, NULL, NULL, -1, 'system'),  -- signOut
(3,  6,  2, ARRAY['id', 'serviceName', 'resourceName', 'url', 'name', 'description', 'methods'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchRoutes
(3, 12,  2, ARRAY['id', 'name', 'pattern'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchServices
(3, 18,  2, ARRAY['id', 'serviceName', 'name'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchResources
(3, 24,  2, ARRAY['id', 'name', 'description'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchOperations
(3, 30,  2, ARRAY['id', 'name'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchCors
(3, 36,  2, ARRAY['id', 'resourceId', 'name'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchFields
(3, 42,  2, ARRAY['id', 'value'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchScopes
(3, 48,  2, ARRAY['id', 'name', 'description', 'color'], (ARRAY[(SELECT id FROM condition WHERE name = 'Non-archived only')]), -1, 'system'),  -- searchRoles
(3, 73,  2, NULL, NULL, -1, 'system'),  -- getPreferences
(3, 74,  6, NULL, NULL, -1, 'system'),  -- addPreferences
(3, 75,  5, NULL, NULL, -1, 'system'),  -- updatePreferences
(3, 76, 10, NULL, NULL, -1, 'system'),  -- deletePreference

-- ============================================================
-- Guest (4): session routes only
-- ============================================================
(4,  1,  4, NULL, NULL, -1, 'system'),  -- refreshToken
(4,  3,  8, NULL, NULL, -1, 'system')   -- signOut
;