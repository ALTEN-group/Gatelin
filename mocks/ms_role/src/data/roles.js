// Mock roles database
export const mockRoles = [
  {
    id: 1,
    name: 'Super admin',
    description: 'Administrator role with full permissions',
    color: '#FF5722',
    permissions: [
      {
        route: 1,
        operations: [2,3,4]
      },
      {
        route: 2,
        operations: [2,3,4]
      },
      {
        route: 3,
        operations: [2,3,4]
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Admin',
    description: 'Administrator role with full permissions',
    color: '#2196F3',
    level: 1,
    permissions: [
      {
        route: 1,
        operations: [2,3,4]
      },
      {
        route: 2,
        operations: [2,3,4]
      },
      {
        route: 3,
        operations: [2,3,4]
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'User',
    description: 'Standard user role with basic permissions',
    color: '#4CAF50',
    level: 2,
    permissions: [
      {
        route: 1,
        operations: [2,3,4]
      },
      {
        route: 2,
        operations: [2,3,4]
      },
      {
        route: 3,
        operations: [2,3,4]
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Guest',
    description: 'Guest user role with limited permissions',
    color: '#9E9E9E',
    level: 3,
    permissions: [
      {
        route: 1,
        operations: [2,3,4]
      },
      {
        route: 2,
        operations: [2,3,4]
      },
      {
        route: 3,
        operations: [2,3,4]
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }
];
