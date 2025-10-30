/**
 * @jest-environment node
 */

// Set up environment variable before any imports
process.env.MSUSER_URL = 'https://user.example.com';

// Mock dependencies before imports
jest.mock('@dwtechs/winstan');
jest.mock('httpclient');

const mockLog = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

const mockHttpclient = {
  query: jest.fn()
};

// Set up mocks
require('@dwtechs/winstan').log = mockLog;
require('httpclient').default = mockHttpclient;

describe('Get User By Email Middleware', () => {
  let getUserByEmail;
  let req, res, next;

  beforeAll(async () => {
    // Dynamically import the middleware
    const getUserByEmailModule = await import('../../../src/middlewares/http/get-user-by-email.js');
    getUserByEmail = getUserByEmailModule.default;
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request object
    req = {
      body: {
        rows: [{
          email: 'test@example.com'
        }]
      },
      additionalHeaders: {
        'x-consumer-id': 'consumer123',
        'x-consumer-username': 'testuser'
      }
    };
    
    // Setup response object
    res = {
      locals: {}
    };
    
    // Setup next function
    next = jest.fn();
  });

  afterAll(() => {
    // Clean up environment variable
    delete process.env.MSUSER_URL;
  });

  describe('Successful User Retrieval', () => {
    test('should retrieve user by email and populate request/response data', async () => {
      const mockUserData = {
        id: 'user123',
        email: 'test@example.com',
        nickname: 'testuser',
        roles: ['user', 'customer'],
        active: true,
        name: 'Test User'
      };

      const mockResponse = {
        data: {
          rows: [mockUserData]
        }
      };

      mockHttpclient.query.mockResolvedValue(mockResponse);

      await getUserByEmail(req, res, next);

      // Verify HTTP client was called correctly
      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://user.example.com/users/',
        null,
        {
          filters: {
            email: {
              value: 'test@example.com',
              matchMode: 'equals'
            },
            archived: {
              value: false,
              matchMode: 'is'
            }
          }
        },
        req.additionalHeaders
      );

      // Verify response data is populated
      expect(res.rows).toBe(mockUserData);
      
      // Verify request body is enriched
      expect(req.body.id).toBe('user123');
      expect(req.body.nickname).toBe('testuser');
      expect(req.body.roles).toEqual(['user', 'customer']);
      
      // Verify response locals
      expect(res.locals.active).toBe(true);
      
      // Verify logging
      expect(mockLog.debug).toHaveBeenCalledWith(`ms_user response: ${mockUserData.toString()}`);
      
      // Verify next was called
      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should handle user with different email address', async () => {
      req.body.rows[0].email = 'admin@company.com';
      
      const mockUserData = {
        id: 'admin456',
        email: 'admin@company.com',
        nickname: 'admin',
        roles: ['admin', 'superuser'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://user.example.com/users/',
        null,
        {
          filters: {
            email: {
              value: 'admin@company.com',
              matchMode: 'equals'
            },
            archived: {
              value: false,
              matchMode: 'is'
            }
          }
        },
        req.additionalHeaders
      );

      expect(req.body.id).toBe('admin456');
      expect(req.body.nickname).toBe('admin');
      expect(req.body.roles).toEqual(['admin', 'superuser']);
    });

    test('should handle inactive user', async () => {
      const mockUserData = {
        id: 'user789',
        email: 'test@example.com',
        nickname: 'inactiveuser',
        roles: ['user'],
        active: false
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(res.locals.active).toBe(false);
      expect(req.body.id).toBe('user789');
    });

    test('should handle user with no roles', async () => {
      const mockUserData = {
        id: 'user999',
        email: 'test@example.com',
        nickname: 'noroleuser',
        roles: [],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(req.body.roles).toEqual([]);
    });

    test('should handle user with null/undefined properties', async () => {
      const mockUserData = {
        id: 'user000',
        email: 'test@example.com',
        nickname: null,
        roles: undefined,
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(req.body.nickname).toBe(null);
      expect(req.body.roles).toBe(undefined);
      expect(res.locals.active).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should call next with error when HTTP request fails', (done) => {
      const httpError = new Error('User service unavailable');
      httpError.statusCode = 503;
      mockHttpclient.query.mockRejectedValue(httpError);

      next.mockImplementation((error) => {
        expect(error).toBe(httpError);
        expect(error.statusCode).toBe(503);
        expect(mockHttpclient.query).toHaveBeenCalledWith(
          'POST',
          'https://user.example.com/users/',
          null,
          {
            filters: {
              email: {
                value: 'test@example.com',
                matchMode: 'equals'
              },
              archived: {
                value: false,
                matchMode: 'is'
              }
            }
          },
          req.additionalHeaders
        );
        done();
      });

      getUserByEmail(req, res, next);
    });

    test('should handle network timeout errors', (done) => {
      const networkError = new Error('Network timeout');
      networkError.code = 'TIMEOUT';
      mockHttpclient.query.mockRejectedValue(networkError);

      next.mockImplementation((error) => {
        expect(error).toBe(networkError);
        expect(error.code).toBe('TIMEOUT');
        done();
      });

      getUserByEmail(req, res, next);
    });

    test('should handle user not found (404) errors', (done) => {
      const notFoundError = new Error('User not found');
      notFoundError.statusCode = 404;
      mockHttpclient.query.mockRejectedValue(notFoundError);

      next.mockImplementation((error) => {
        expect(error).toBe(notFoundError);
        expect(error.statusCode).toBe(404);
        done();
      });

      getUserByEmail(req, res, next);
    });

    test('should handle unauthorized (401) errors', (done) => {
      const authError = new Error('Unauthorized');
      authError.statusCode = 401;
      mockHttpclient.query.mockRejectedValue(authError);

      next.mockImplementation((error) => {
        expect(error).toBe(authError);
        expect(error.statusCode).toBe(401);
        done();
      });

      getUserByEmail(req, res, next);
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing additionalHeaders', async () => {
      delete req.additionalHeaders;
      
      const mockUserData = {
        id: 'user123',
        email: 'test@example.com',
        nickname: 'testuser',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://user.example.com/users/',
        null,
        expect.any(Object),
        {}
      );
    });

    test('should handle null additionalHeaders', async () => {
      req.additionalHeaders = null;
      
      const mockUserData = {
        id: 'user123',
        email: 'test@example.com',
        nickname: 'testuser',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://user.example.com/users/',
        null,
        expect.any(Object),
        {}
      );
    });

    test('should handle email with special characters', async () => {
      req.body.rows[0].email = 'user+test@example-domain.co.uk';
      
      const mockUserData = {
        id: 'specialuser',
        email: 'user+test@example-domain.co.uk',
        nickname: 'specialuser',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://user.example.com/users/',
        null,
        {
          filters: {
            email: {
              value: 'user+test@example-domain.co.uk',
              matchMode: 'equals'
            },
            archived: {
              value: false,
              matchMode: 'is'
            }
          }
        },
        expect.any(Object)
      );
    });

    test('should handle complex user data structure', async () => {
      const mockUserData = {
        id: 'complex123',
        email: 'test@example.com',
        nickname: 'complexuser',
        roles: ['user', 'premium', 'beta-tester'],
        active: true,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          preferences: {
            theme: 'dark',
            notifications: true
          }
        },
        metadata: {
          lastLogin: '2025-10-07T10:00:00Z',
          loginCount: 42
        }
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(res.rows).toEqual(mockUserData);
      expect(req.body.roles).toEqual(['user', 'premium', 'beta-tester']);
    });
  });

  describe('Filter Configuration', () => {
    test('should use correct filters for user lookup', async () => {
      const mockUserData = {
        id: 'user123',
        email: 'test@example.com',
        nickname: 'testuser',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      const expectedFilters = {
        email: {
          value: 'test@example.com',
          matchMode: 'equals'
        },
        archived: {
          value: false,
          matchMode: 'is'
        }
      };

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://user.example.com/users/',
        null,
        { filters: expectedFilters },
        expect.any(Object)
      );
    });

    test('should always filter out archived users', async () => {
      req.body.rows[0].email = 'any@email.com';
      
      const mockUserData = {
        id: 'user123',
        email: 'any@email.com',
        nickname: 'testuser',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      const callArgs = mockHttpclient.query.mock.calls[0];
      const filters = callArgs[3].filters;
      
      expect(filters.archived).toEqual({
        value: false,
        matchMode: 'is'
      });
    });

    test('should use exact email match mode', async () => {
      const mockUserData = {
        id: 'user123',
        email: 'test@example.com',
        nickname: 'testuser',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      const callArgs = mockHttpclient.query.mock.calls[0];
      const filters = callArgs[3].filters;
      
      expect(filters.email.matchMode).toBe('equals');
    });
  });

  describe('Environment Configuration', () => {
    test('should use MSUSER_URL from environment', async () => {
      const mockUserData = {
        id: 'user123',
        email: 'test@example.com',
        nickname: 'testuser',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://user.example.com/users/',
        null,
        expect.any(Object),
        expect.any(Object)
      );
    });

    test('should construct correct endpoint URL', async () => {
      const mockUserData = {
        id: 'user123',
        email: 'test@example.com',
        nickname: 'testuser',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      const callArgs = mockHttpclient.query.mock.calls[0];
      expect(callArgs[1]).toBe('https://user.example.com/users/');
    });
  });

  describe('Data Transformation', () => {
    test('should correctly transform user data to request/response objects', async () => {
      const mockUserData = {
        id: 'transform123',
        email: 'transform@example.com',
        nickname: 'transformer',
        roles: ['transformer', 'data-handler'],
        active: true,
        additionalField: 'should-be-preserved'
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      // Verify all data transformations
      expect(res.rows).toBe(mockUserData); // Full user object
      expect(req.body.id).toBe('transform123'); // ID extracted
      expect(req.body.nickname).toBe('transformer'); // Nickname extracted
      expect(req.body.roles).toEqual(['transformer', 'data-handler']); // Roles extracted
      expect(res.locals.active).toBe(true); // Active status extracted
    });

    test('should preserve original request body data while adding new fields', async () => {
      req.body.originalField = 'should-remain';
      req.body.anotherField = { nested: 'data' };
      
      const mockUserData = {
        id: 'preserve123',
        email: 'test@example.com',
        nickname: 'preserver',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      // Original data should be preserved
      expect(req.body.originalField).toBe('should-remain');
      expect(req.body.anotherField).toEqual({ nested: 'data' });
      expect(req.body.rows).toEqual([{ email: 'test@example.com' }]);
      
      // New data should be added
      expect(req.body.id).toBe('preserve123');
      expect(req.body.nickname).toBe('preserver');
      expect(req.body.roles).toEqual(['user']);
    });
  });

  describe('Logging Verification', () => {
    test('should log user response data', async () => {
      const mockUserData = {
        id: 'log123',
        email: 'test@example.com',
        nickname: 'logger',
        roles: ['user'],
        active: true
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith(`ms_user response: ${mockUserData.toString()}`);
    });

    test('should handle logging of complex user objects', async () => {
      const mockUserData = {
        id: 'complex123',
        email: 'test@example.com',
        nickname: 'complex',
        roles: ['user', 'admin'],
        active: true,
        metadata: { key: 'value' }
      };

      mockHttpclient.query.mockResolvedValue({
        data: { rows: [mockUserData] }
      });

      await getUserByEmail(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledTimes(1);
      expect(mockLog.debug).toHaveBeenCalledWith(expect.stringContaining('ms_user response:'));
    });
  });

  describe('Concurrent Processing', () => {
    test('should handle concurrent requests', async () => {
      const req1 = { 
        body: { rows: [{ email: 'user1@example.com' }] },
        additionalHeaders: { 'x-consumer-id': 'consumer1' }
      };
      const req2 = { 
        body: { rows: [{ email: 'user2@example.com' }] },
        additionalHeaders: { 'x-consumer-id': 'consumer2' }
      };
      const req3 = { 
        body: { rows: [{ email: 'user3@example.com' }] },
        additionalHeaders: { 'x-consumer-id': 'consumer3' }
      };

      const res1 = { locals: {} };
      const res2 = { locals: {} };
      const res3 = { locals: {} };

      const mockUserData1 = { id: 'user1', email: 'user1@example.com', nickname: 'user1', roles: ['user'], active: true };
      const mockUserData2 = { id: 'user2', email: 'user2@example.com', nickname: 'user2', roles: ['user'], active: true };
      const mockUserData3 = { id: 'user3', email: 'user3@example.com', nickname: 'user3', roles: ['user'], active: true };

      mockHttpclient.query
        .mockResolvedValueOnce({ data: { rows: [mockUserData1] } })
        .mockResolvedValueOnce({ data: { rows: [mockUserData2] } })
        .mockResolvedValueOnce({ data: { rows: [mockUserData3] } });

      const promises = [
        getUserByEmail(req1, res1, next),
        getUserByEmail(req2, res2, next),
        getUserByEmail(req3, res3, next)
      ];

      await Promise.all(promises);

      expect(mockHttpclient.query).toHaveBeenCalledTimes(3);
      expect(next).toHaveBeenCalledTimes(3);
      
      expect(req1.body.id).toBe('user1');
      expect(req2.body.id).toBe('user2');
      expect(req3.body.id).toBe('user3');
    });
  });
});