/**
 * Base ACLs for the application, defining mapping between routes and their id in the database.
 */
export const BASE_ACLS = {
    consumers: {
        get: 4, // getConsumers
    },
    routes: {
        get: 6, // searchRoutes
        getHistory: 7,
        update: 8,
        create: 9,
        archive: 10,
    },
    services: {
        get: 11, // searchServices
        getHistory: 12,
        update: 13,
        create: 14,
        archive: 15,
    },
    resources: {
        get: 16, // searchResources
        getHistory: 17,
        update: 18,
        create: 19,
        archive: 20,
    },
    operations: {
        get: 21, // searchOperations
        getHistory: 22,
        update: 23,
        create: 24,
        archive: 25,
    },
    cors: {
        get: 26, // searchCors
        getHistory: 27,
        update: 28,
        create: 29,
        archive: 30,
    },
    fields: {
        get: 31, // searchFields
        getHistory: 32,
        update: 33,
        create: 34,
        archive: 35,
    },
    scopes: {
        get: 36, // searchScopes
        getHistory: 37,
        update: 38,
        create: 39,
        archive: 40,
    },
    roles: {
        get: 41, // searchRoles
        getHistory: 42,
        create: 43,
        update: 44,
        archive: 45,
    },
    permissions: {
        get: 46, // searchPermissions
        getHistory: 47, // getPermissionHistory
        create: 48, // addPermissions
        update: 49, // updatePermissions
        archive: 50, // deletePermissions
    },
    methods: {
        get: 51, // searchMethods
        update: 52, // updateMethods
    },
    applications: {
        get: 53, // searchApplications
        getHistory: 54, // getApplicationHistory
        create: 55, // addApplications
        update: 56, // updateApplications
        archive: 57, // archiveApplications
    },
    conditions: {
        get: 58, // searchConditions
        getHistory: 59, // getConditionHistory
        update: 60, // updateConditions
        create: 61, // addConditions
        archive: 62, // archiveConditions
    },
};
//# sourceMappingURL=app.acls.js.map