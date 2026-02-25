// Mock roles database
export const mockRoles = [
  {
    id: 1,
    name: "Super admin",
    description: "Administrator role with full permissions",
    color: "#FF5722",
    permissions: [
      // Sessions - all operations
      { route: 1, operations: [3] }, // refreshToken
      { route: 2, operations: [5] }, // signIn
      { route: 3, operations: [7] }, // signOut

      // Consumers - all operations
      { route: 4, operations: [2] }, // getConsumers
      { route: 5, operations: [8] }, // archiveConsumers

      // Routes - all operations
      { route: 6, operations: [2] }, // searchRoutes
      { route: 7, operations: [2] }, // getRouteHistory
      { route: 8, operations: [4] }, // updateRoutes
      { route: 9, operations: [6] }, // addRoutes
      { route: 10, operations: [8] }, // archiveRoutes

      // Services - all operations
      { route: 11, operations: [2] }, // searchServices
      { route: 12, operations: [2] }, // getServiceHistory
      { route: 13, operations: [4] }, // updateServices
      { route: 14, operations: [6] }, // addServices
      { route: 15, operations: [8] }, // archiveServices

      // Resources - all operations
      { route: 16, operations: [2] }, // searchResources
      { route: 17, operations: [2] }, // getResourceHistory
      { route: 18, operations: [4] }, // updateResources
      { route: 19, operations: [6] }, // addResources
      { route: 20, operations: [8] }, // archiveResources

      // Operations - all operations
      { route: 21, operations: [2] }, // searchOperations
      { route: 22, operations: [2] }, // getOperationHistory
      { route: 23, operations: [4] }, // updateOperations
      { route: 24, operations: [6] }, // addOperations
      { route: 25, operations: [8] }, // archiveOperations

      // CORS - all operations
      { route: 26, operations: [2] }, // searchCors
      { route: 27, operations: [2] }, // getCorsHistory
      { route: 28, operations: [4] }, // updateCors
      { route: 29, operations: [6] }, // addCors
      { route: 30, operations: [8] }, // archiveCors

      // Users
      { route: 31, operations: [1] }, // getBasicUserInfo

      // Roles
      { route: 32, operations: [2] }, // searchRoles
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrator role with most permissions except delete",
    color: "#2196F3",
    permissions: [
      // Sessions
      { route: 1, operations: [3] }, // refreshToken
      { route: 2, operations: [5] }, // signIn
      { route: 3, operations: [7] }, // signOut

      // Consumers
      { route: 4, operations: [2] }, // getConsumers
      { route: 5, operations: [8] }, // archiveConsumers

      // Routes
      { route: 6, operations: [2] }, // searchRoutes
      { route: 7, operations: [2] }, // getRouteHistory
      { route: 8, operations: [4] }, // updateRoutes
      { route: 9, operations: [6] }, // addRoutes
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

      // Users
      { route: 31, operations: [1] }, // getBasicUserInfo

      // Roles
      { route: 32, operations: [2] }, // searchRoles
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "User",
    description: "Standard user role with read permissions",
    color: "#4CAF50",
    permissions: [
      // Sessions - own account only
      { route: 1, operations: [3] }, // refreshToken
      { route: 2, operations: [5] }, // signIn
      { route: 3, operations: [7] }, // signOut

      // Routes - read only
      { route: 6, operations: [2] }, // searchRoutes

      // Services - read only
      { route: 11, operations: [2] }, // searchServices

      // Resources - read only
      { route: 16, operations: [2] }, // searchResources

      // Operations - read only
      { route: 21, operations: [2] }, // searchOperations

      // CORS - read only
      { route: 26, operations: [2] }, // searchCors

      // Users
      { route: 31, operations: [1] }, // getBasicUserInfo

      // Roles
      { route: 32, operations: [2] }, // searchRoles
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
      // Sessions - sign in only
      { route: 2, operations: [5] }, // signIn

      // Users - basic info only
      { route: 31, operations: [1] }, // getBasicUserInfo
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];
