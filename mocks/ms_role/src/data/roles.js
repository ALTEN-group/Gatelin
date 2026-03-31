// Mock roles database
export const mockRoles = [
  {
    // Super admin: no fields restriction — full access to all properties
    id: 1,
    name: "Super admin",
    description: "Administrator role with full permissions",
    color: "#FF5722",
    permissions: [
      // Sessions
      { route: 1, operations: [3] }, // refreshToken
      { route: 3, operations: [7] }, // signOut

      // Consumers
      { route: 4,  operations: [2] }, // getConsumers
      { route: 5,  operations: [8] }, // archiveConsumers

      // Routes
      { route: 6,  operations: [2] }, // searchRoutes
      { route: 7,  operations: [2] }, // getRouteHistory
      { route: 8,  operations: [4] }, // updateRoutes
      { route: 9,  operations: [6] }, // addRoutes
      { route: 10, operations: [8] }, // archiveRoutes

      // Services
      { route: 11, operations: [2] }, // searchServices
      { route: 12, operations: [2] }, // getServiceHistory
      { route: 13, operations: [4] }, // updateServices
      { route: 14, operations: [6] }, // addServices
      { route: 15, operations: [8] }, // archiveServices

      // Resources
      { route: 16, operations: [2] }, // searchResources
      { route: 17, operations: [2] }, // getResourceHistory
      { route: 18, operations: [4] }, // updateResources
      { route: 19, operations: [6] }, // addResources
      { route: 20, operations: [8] }, // archiveResources

      // Operations
      { route: 21, operations: [2] }, // searchOperations
      { route: 22, operations: [2] }, // getOperationHistory
      { route: 23, operations: [4] }, // updateOperations
      { route: 24, operations: [6] }, // addOperations
      { route: 25, operations: [8] }, // archiveOperations

      // CORS
      { route: 26, operations: [2] }, // searchCors
      { route: 27, operations: [2] }, // getCorsHistory
      { route: 28, operations: [4] }, // updateCors
      { route: 29, operations: [6] }, // addCors
      { route: 30, operations: [8] }, // archiveCors

      // Fields
      { route: 31, operations: [2] },  // searchFields
      { route: 32, operations: [2] },  // getFieldHistory
      { route: 33, operations: [4] },  // updateFields
      { route: 34, operations: [6] },  // addFields
      { route: 35, operations: [8] },  // archiveFields

      // Preferences
      { route: 36, operations: [2] },                                                                                        // getPreferences
      { route: 37, operations: [11], scope: ["routes", "consumers", "services", "resources", "operations", "cors"] }, // syncPreferences

      // Users
      { route: 38, operations: [1] },  // getBasicUserInfo
      { route: 39, operations: [2] },  // getUserPreferences
      { route: 40, operations: [11], scope: ["users"] }, // syncUserPreferences

      // Roles
      { route: 41, operations: [2] },  // searchRoles
      { route: 42, operations: [2] },  // getRolePreferences
      { route: 43, operations: [11], scope: ["roles"] }, // syncRolePreferences
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    // Admin: can read all fields but cannot write the "locked" property
    id: 2,
    name: "Admin",
    description: "Administrator role with most permissions except locking entities",
    color: "#2196F3",
    permissions: [
      // Sessions
      { route: 1, operations: [3] }, // refreshToken
      { route: 3, operations: [7] }, // signOut

      // Consumers
      { route: 4,  operations: [2] }, // getConsumers
      { route: 5,  operations: [8] }, // archiveConsumers

      // Routes
      { route: 6,  operations: [2] }, // searchRoutes
      { route: 7,  operations: [2] }, // getRouteHistory
      { route: 8,  operations: [4], fields: ["name", "description", "pattern", "methods", "isProtected"] }, // updateRoutes - no locked
      { route: 9,  operations: [6], fields: ["serviceId", "resourceId", "operationId", "pattern", "name", "description", "methods", "isProtected"] }, // addRoutes - no locked
      { route: 10, operations: [8] }, // archiveRoutes

      // Services
      { route: 11, operations: [2] }, // searchServices
      { route: 12, operations: [2] }, // getServiceHistory
      { route: 13, operations: [4], fields: ["name", "pattern"] }, // updateServices - no locked
      { route: 14, operations: [6], fields: ["name", "pattern"] }, // addServices - no locked
      { route: 15, operations: [8] }, // archiveServices

      // Resources
      { route: 16, operations: [2] }, // searchResources
      { route: 17, operations: [2] }, // getResourceHistory
      { route: 18, operations: [4], fields: ["serviceId", "name"] }, // updateResources - no locked
      { route: 19, operations: [6], fields: ["serviceId", "name"] }, // addResources - no locked
      { route: 20, operations: [8] }, // archiveResources

      // Operations
      { route: 21, operations: [2] }, // searchOperations
      { route: 22, operations: [2] }, // getOperationHistory
      { route: 23, operations: [4], fields: ["name", "description"] }, // updateOperations
      { route: 24, operations: [6], fields: ["name", "description"] }, // addOperations
      { route: 25, operations: [8] }, // archiveOperations

      // CORS
      { route: 26, operations: [2] }, // searchCors
      { route: 27, operations: [2] }, // getCorsHistory
      { route: 28, operations: [4], fields: ["name"] }, // updateCors
      { route: 29, operations: [6], fields: ["name"] }, // addCors
      { route: 30, operations: [8] }, // archiveCors

      // Fields
      { route: 31, operations: [2] },  // searchFields
      { route: 32, operations: [2] },  // getFieldHistory
      { route: 33, operations: [4], fields: ["name"] }, // updateFields - no locked
      { route: 34, operations: [6], fields: ["resourceId", "name"] }, // addFields - no locked
      { route: 35, operations: [8] },  // archiveFields

      // Preferences
      { route: 36, operations: [2] },                                                                                        // getPreferences
      { route: 37, operations: [11], scope: ["routes", "consumers", "services", "resources", "operations", "cors"] }, // syncPreferences

      // Users
      { route: 38, operations: [1] },  // getBasicUserInfo
      { route: 39, operations: [2] },  // getUserPreferences
      { route: 40, operations: [11], scope: ["users"] }, // syncUserPreferences

      // Roles
      { route: 41, operations: [2] },  // searchRoles
      { route: 42, operations: [2] },  // getRolePreferences
      { route: 43, operations: [11], scope: ["roles"] }, // syncRolePreferences
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    // User: read-only with public fields only (no audit, no admin flags)
    id: 3,
    name: "User",
    description: "Standard user role with read-only access to public fields",
    color: "#4CAF50",
    permissions: [
      // Sessions
      { route: 1, operations: [3] }, // refreshToken
      { route: 3, operations: [7] }, // signOut

      // Routes - public fields only
      { route: 6,  operations: [2], fields: ["id", "serviceName", "resourceName", "operationName", "url", "name", "description", "methods"] }, // searchRoutes

      // Services - public fields only
      { route: 11, operations: [2], fields: ["id", "name", "pattern"] }, // searchServices

      // Resources - public fields only
      { route: 16, operations: [2], fields: ["id", "serviceName", "name"] }, // searchResources

      // Operations - public fields only
      { route: 21, operations: [2], fields: ["id", "name", "description"] }, // searchOperations

      // CORS - public fields only
      { route: 26, operations: [2], fields: ["id", "name"] }, // searchCors

      // Fields
      { route: 31, operations: [2], fields: ["id", "resourceId", "name"] }, // searchFields - public fields only

      // Preferences
      { route: 36, operations: [2] }, // getPreferences

      // Users
      { route: 38, operations: [1] },  // getBasicUserInfo
      { route: 39, operations: [2] },  // getUserPreferences
      { route: 40, operations: [11] }, // syncUserPreferences

      // Roles
      { route: 41, operations: [2], fields: ["id", "name", "description", "color", "level"] }, // searchRoles
      { route: 42, operations: [2] },  // getRolePreferences - read only for regular users
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Guest",
    description: "Guest user role with minimal permissions",
    color: "#9E9E9E",
    permissions: [
      // Sessions only
      { route: 1, operations: [3] }, // refreshToken
      { route: 3, operations: [7] }, // signOut
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];
