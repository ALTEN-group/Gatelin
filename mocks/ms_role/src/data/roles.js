// Mock roles database
export const mockRoles = [
  {
    id: 1,
    name: "Super admin",
    description: "Administrator role with full permissions",
    color: "#FF5722",
    permissions: [
      // Consumers - all operations
      { route: 1, operations: [2] }, // getConsumers
      { route: 2, operations: [5] }, // refreshToken
      { route: 3, operations: [3] }, // signIn
      { route: 4, operations: [7] }, // signOut
      { route: 5, operations: [10] }, // deleteConsumers

      // Routes - all operations
      { route: 6, operations: [2] }, // searchRoutes
      { route: 7, operations: [2] }, // getRouteHistory
      { route: 8, operations: [5] }, // updateRoutes
      { route: 9, operations: [4] }, // addRoutes
      { route: 10, operations: [8] }, // archiveRoutes
      { route: 11, operations: [10] }, // deleteRoutes

      // Services - all operations
      { route: 12, operations: [2] }, // searchServices
      { route: 13, operations: [2] }, // getServiceHistory
      { route: 14, operations: [5] }, // updateServices
      { route: 15, operations: [4] }, // addServices
      { route: 16, operations: [8] }, // archiveServices
      { route: 17, operations: [10] }, // deleteServices

      // Resources - all operations
      { route: 18, operations: [2] }, // searchResources
      { route: 19, operations: [2] }, // getResourceHistory
      { route: 20, operations: [5] }, // updateResources
      { route: 21, operations: [4] }, // addResources
      { route: 22, operations: [8] }, // archiveResources
      { route: 23, operations: [10] }, // deleteResources

      // Operations - all operations
      { route: 24, operations: [2] }, // searchOperations
      { route: 25, operations: [2] }, // getOperationHistory
      { route: 26, operations: [5] }, // updateOperations
      { route: 27, operations: [4] }, // addOperations
      { route: 28, operations: [8] }, // archiveOperations
      { route: 29, operations: [10] }, // deleteOperations

      // CORS - all operations
      { route: 30, operations: [2] }, // searchCors
      { route: 31, operations: [2] }, // getCorsHistory
      { route: 32, operations: [5] }, // updateCors
      { route: 33, operations: [4] }, // addCors
      { route: 34, operations: [8] }, // archiveCors
      { route: 35, operations: [10] }, // deleteCors

      // Users
      { route: 36, operations: [1] }, // getBasicUserInfo

      // Roles
      { route: 37, operations: [2] }, // searchRoles
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrator role with most permissions except delete",
    color: "#2196F3",
    level: 1,
    permissions: [
      // Consumers - no delete
      { route: 1, operations: [2] }, // getConsumers
      { route: 2, operations: [5] }, // refreshToken
      { route: 3, operations: [3] }, // signIn
      { route: 4, operations: [7] }, // signOut

      // Routes - no delete
      { route: 6, operations: [2] }, // searchRoutes
      { route: 7, operations: [2] }, // getRouteHistory
      { route: 8, operations: [5] }, // updateRoutes
      { route: 9, operations: [4] }, // addRoutes
      { route: 10, operations: [8] }, // archiveRoutes

      // Services - no delete
      { route: 12, operations: [2] }, // searchServices
      { route: 13, operations: [2] }, // getServiceHistory
      { route: 14, operations: [5] }, // updateServices
      { route: 15, operations: [4] }, // addServices
      { route: 16, operations: [8] }, // archiveServices

      // Resources - no delete
      { route: 18, operations: [2] }, // searchResources
      { route: 19, operations: [2] }, // getResourceHistory
      { route: 20, operations: [5] }, // updateResources
      { route: 21, operations: [4] }, // addResources
      { route: 22, operations: [8] }, // archiveResources

      // Operations - no delete
      { route: 24, operations: [2] }, // searchOperations
      { route: 25, operations: [2] }, // getOperationHistory
      { route: 26, operations: [5] }, // updateOperations
      { route: 27, operations: [4] }, // addOperations
      { route: 28, operations: [8] }, // archiveOperations

      // CORS - no delete
      { route: 30, operations: [2] }, // searchCors
      { route: 31, operations: [2] }, // getCorsHistory
      { route: 32, operations: [5] }, // updateCors
      { route: 33, operations: [4] }, // addCors
      { route: 34, operations: [8] }, // archiveCors

      // Users
      { route: 36, operations: [1] }, // getBasicUserInfo

      // Roles
      { route: 37, operations: [2] }, // searchRoles
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "User",
    description: "Standard user role with read permissions",
    color: "#4CAF50",
    level: 2,
    permissions: [
      // Consumers - own account only
      { route: 2, operations: [5] }, // refreshToken
      { route: 3, operations: [3] }, // signIn
      { route: 4, operations: [7] }, // signOut

      // Routes - read only
      { route: 6, operations: [2] }, // searchRoutes

      // Services - read only
      { route: 12, operations: [2] }, // searchServices

      // Resources - read only
      { route: 18, operations: [2] }, // searchResources

      // Operations - read only
      { route: 24, operations: [2] }, // searchOperations

      // CORS - read only
      { route: 30, operations: [2] }, // searchCors

      // Users
      { route: 36, operations: [1] }, // getBasicUserInfo

      // Roles
      { route: 37, operations: [2] }, // searchRoles
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Guest",
    description: "Guest user role with minimal permissions",
    color: "#9E9E9E",
    level: 3,
    permissions: [
      // Consumers - sign in only
      { route: 3, operations: [3] }, // signIn

      // Users - basic info only
      { route: 36, operations: [1] }, // getBasicUserInfo
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];
