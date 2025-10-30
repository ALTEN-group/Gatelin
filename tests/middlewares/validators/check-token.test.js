/**
 * @jest-environment node
 */

// Mock dependencies before imports
jest.mock('@dwtechs/winstan');
jest.mock('../../../src/services/consumer.js');

const mockLog = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

const mockConsumerService = {
  getOne: jest.fn(),
  matchAccessToken: jest.fn(),
  matchRefreshToken: jest.fn()
};

// Set up mocks
require('@dwtechs/winstan').log = mockLog;
require('../../../src/services/consumer.js').default = mockConsumerService;

describe('Check Token Middleware', () => {
  let checkToken;
  let req, res, next;

  beforeAll(async () => {
    // Dynamically import the middleware
    const checkTokenModule = await import('../../../src/middlewares/validators/check-token.js');
    checkToken = checkTokenModule.default;
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request object
    req = {
      body: {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token'
      },
      decodedRefreshToken: {
        iss: 'consumer-123'
      }
    };
    
    // Setup response object
    res = {};
    
    // Setup next function
    next = jest.fn();
  });

  describe('Successful Token Validation', () => {
    test('should validate tokens and add consumer to request', async () => {
      const mockConsumer = {
        id: 'consumer-123',
        nickname: 'testuser',
        accessToken: 'cached-access-token',
        refreshToken: 'cached-refresh-token',
        maxLevel: 5,
        roles: ['user', 'admin']
      };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null); // null means tokens match
      mockConsumerService.matchRefreshToken.mockReturnValue(null); // null means tokens match

      await checkToken(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('consumer-123');
      expect(mockConsumerService.matchAccessToken).toHaveBeenCalledWith(
        'cached-access-token',
        'valid-access-token'
      );
      expect(mockConsumerService.matchRefreshToken).toHaveBeenCalledWith(
        'cached-refresh-token',
        'valid-refresh-token'
      );
      
      expect(req.consumer).toEqual(mockConsumer);
      expect(next).toHaveBeenCalledWith();
      expect(mockLog.debug).toHaveBeenCalledWith('Check token for consumer consumer-123');
      expect(mockLog.debug).toHaveBeenCalledWith(`Consumer found in cache : ${JSON.stringify(mockConsumer)}`);
    });

    test('should handle consumer with minimal data', async () => {
      const mockConsumer = {
        id: 'consumer-456',
        accessToken: 'minimal-access-token',
        refreshToken: 'minimal-refresh-token'
      };
      
      req.decodedRefreshToken.iss = 'consumer-456';
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);
      mockConsumerService.matchRefreshToken.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(req.consumer).toEqual(mockConsumer);
      expect(next).toHaveBeenCalledWith();
    });

    test('should handle consumer with complex data structure', async () => {
      const mockConsumer = {
        id: 'consumer-789',
        nickname: 'complexuser',
        accessToken: 'complex-access-token',
        refreshToken: 'complex-refresh-token',
        maxLevel: 10,
        roles: ['admin', 'moderator', 'premium'],
        profile: {
          email: 'test@example.com',
          preferences: {
            theme: 'dark',
            notifications: true
          }
        },
        metadata: {
          lastLogin: '2024-01-01T00:00:00Z',
          createdAt: '2023-01-01T00:00:00Z'
        }
      };
      
      req.decodedRefreshToken.iss = 'consumer-789';
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);
      mockConsumerService.matchRefreshToken.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(req.consumer).toEqual(mockConsumer);
      expect(mockLog.debug).toHaveBeenCalledWith(`Consumer found in cache : ${JSON.stringify(mockConsumer)}`);
    });
  });

  describe('Consumer Not Found', () => {
    test('should return 404 error when consumer not found', async () => {
      mockConsumerService.getOne.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('consumer-123');
      expect(next).toHaveBeenCalledWith({
        status: 404,
        msg: "Consumer not found"
      });
      
      expect(mockConsumerService.matchAccessToken).not.toHaveBeenCalled();
      expect(mockConsumerService.matchRefreshToken).not.toHaveBeenCalled();
      expect(req.consumer).toBeUndefined();
      expect(mockLog.debug).toHaveBeenCalledWith('Check token for consumer consumer-123');
    });

    test('should return 404 error when consumer service returns undefined', async () => {
      mockConsumerService.getOne.mockReturnValue(undefined);

      await checkToken(req, res, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        msg: "Consumer not found"
      });
    });

    test('should handle different consumer ID formats', async () => {
      const testCases = [
        'uuid-consumer-id',
        '12345',
        'consumer@domain.com',
        'consumer-with-special-chars-123_456'
      ];

      for (const consumerId of testCases) {
        jest.clearAllMocks();
        req.decodedRefreshToken.iss = consumerId;
        mockConsumerService.getOne.mockReturnValue(null);

        await checkToken(req, res, next);

        expect(mockConsumerService.getOne).toHaveBeenCalledWith(consumerId);
        expect(mockLog.debug).toHaveBeenCalledWith(`Check token for consumer ${consumerId}`);
        expect(next).toHaveBeenCalledWith({
          status: 404,
          msg: "Consumer not found"
        });
      }
    });
  });

  describe('Access Token Validation Failure', () => {
    test('should return error when access token does not match', async () => {
      const mockConsumer = {
        id: 'consumer-123',
        accessToken: 'cached-access-token',
        refreshToken: 'cached-refresh-token'
      };
      
      const accessTokenError = {
        status: 401,
        msg: "Invalid access token"
      };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(accessTokenError);

      await checkToken(req, res, next);

      expect(mockConsumerService.matchAccessToken).toHaveBeenCalledWith(
        'cached-access-token',
        'valid-access-token'
      );
      expect(next).toHaveBeenCalledWith(accessTokenError);
      
      // Should not proceed to refresh token validation
      expect(mockConsumerService.matchRefreshToken).not.toHaveBeenCalled();
      expect(req.consumer).toBeUndefined();
    });

    test('should handle different access token error formats', async () => {
      const mockConsumer = {
        id: 'consumer-123',
        accessToken: 'cached-token',
        refreshToken: 'cached-refresh'
      };
      
      const errorFormats = [
        { status: 401, msg: "Token expired" },
        { status: 401, msg: "Token malformed" },
        { status: 403, msg: "Token revoked" },
        { status: 400, msg: "Token missing" }
      ];

      for (const error of errorFormats) {
        jest.clearAllMocks();
        mockConsumerService.getOne.mockReturnValue(mockConsumer);
        mockConsumerService.matchAccessToken.mockReturnValue(error);

        await checkToken(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(mockConsumerService.matchRefreshToken).not.toHaveBeenCalled();
      }
    });
  });

  describe('Refresh Token Validation Failure', () => {
    test('should return error when refresh token does not match', async () => {
      const mockConsumer = {
        id: 'consumer-123',
        accessToken: 'cached-access-token',
        refreshToken: 'cached-refresh-token'
      };
      
      const refreshTokenError = {
        status: 401,
        msg: "Invalid refresh token"
      };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null); // Access token is valid
      mockConsumerService.matchRefreshToken.mockReturnValue(refreshTokenError);

      await checkToken(req, res, next);

      expect(mockConsumerService.matchAccessToken).toHaveBeenCalledWith(
        'cached-access-token',
        'valid-access-token'
      );
      expect(mockConsumerService.matchRefreshToken).toHaveBeenCalledWith(
        'cached-refresh-token',
        'valid-refresh-token'
      );
      expect(next).toHaveBeenCalledWith(refreshTokenError);
      expect(req.consumer).toBeUndefined();
    });

    test('should handle various refresh token errors', async () => {
      const mockConsumer = {
        id: 'consumer-123',
        accessToken: 'cached-access',
        refreshToken: 'cached-refresh'
      };
      
      const refreshTokenErrors = [
        { status: 401, msg: "Refresh token expired" },
        { status: 401, msg: "Refresh token invalid signature" },
        { status: 403, msg: "Refresh token blacklisted" },
        { status: 400, msg: "Refresh token format invalid" }
      ];

      for (const error of refreshTokenErrors) {
        jest.clearAllMocks();
        mockConsumerService.getOne.mockReturnValue(mockConsumer);
        mockConsumerService.matchAccessToken.mockReturnValue(null);
        mockConsumerService.matchRefreshToken.mockReturnValue(error);

        await checkToken(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(req.consumer).toBeUndefined();
      }
    });
  });

  describe('Request Body Variations', () => {
    test('should handle missing accessToken in request body', async () => {
      delete req.body.accessToken;
      const mockConsumer = { id: 'consumer-123', accessToken: 'cached', refreshToken: 'cached' };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(mockConsumerService.matchAccessToken).toHaveBeenCalledWith(
        'cached',
        undefined
      );
    });

    test('should handle missing refreshToken in request body', async () => {
      delete req.body.refreshToken;
      const mockConsumer = { id: 'consumer-123', accessToken: 'cached', refreshToken: 'cached' };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);
      mockConsumerService.matchRefreshToken.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(mockConsumerService.matchRefreshToken).toHaveBeenCalledWith(
        'cached',
        undefined
      );
    });

    test('should handle empty tokens in request body', async () => {
      req.body.accessToken = '';
      req.body.refreshToken = '';
      const mockConsumer = { id: 'consumer-123', accessToken: 'cached', refreshToken: 'cached' };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);
      mockConsumerService.matchRefreshToken.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(mockConsumerService.matchAccessToken).toHaveBeenCalledWith('cached', '');
      expect(mockConsumerService.matchRefreshToken).toHaveBeenCalledWith('cached', '');
    });

    test('should handle null tokens in request body', async () => {
      req.body.accessToken = null;
      req.body.refreshToken = null;
      const mockConsumer = { id: 'consumer-123', accessToken: 'cached', refreshToken: 'cached' };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);
      mockConsumerService.matchRefreshToken.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(mockConsumerService.matchAccessToken).toHaveBeenCalledWith('cached', null);
      expect(mockConsumerService.matchRefreshToken).toHaveBeenCalledWith('cached', null);
    });
  });

  describe('DecodedRefreshToken Variations', () => {
    test('should handle missing decodedRefreshToken', async () => {
      delete req.decodedRefreshToken;

      await expect(async () => {
        await checkToken(req, res, next);
      }).rejects.toThrow();
    });

    test('should handle missing iss in decodedRefreshToken', async () => {
      req.decodedRefreshToken = {};

      await checkToken(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith(undefined);
      expect(mockLog.debug).toHaveBeenCalledWith('Check token for consumer undefined');
    });

    test('should handle null iss in decodedRefreshToken', async () => {
      req.decodedRefreshToken.iss = null;

      await checkToken(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith(null);
      expect(mockLog.debug).toHaveBeenCalledWith('Check token for consumer null');
    });

    test('should handle empty string iss in decodedRefreshToken', async () => {
      req.decodedRefreshToken.iss = '';

      await checkToken(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('');
      expect(mockLog.debug).toHaveBeenCalledWith('Check token for consumer ');
    });
  });

  describe('Service Error Handling', () => {
    test('should handle consumer service getOne throwing error', async () => {
      mockConsumerService.getOne.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      await expect(async () => {
        await checkToken(req, res, next);
      }).rejects.toThrow('Database connection failed');

      expect(mockLog.debug).toHaveBeenCalledWith('Check token for consumer consumer-123');
    });

    test('should handle matchAccessToken service throwing error', async () => {
      const mockConsumer = { id: 'consumer-123', accessToken: 'cached', refreshToken: 'cached' };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockImplementation(() => {
        throw new Error('Token validation service error');
      });

      await expect(async () => {
        await checkToken(req, res, next);
      }).rejects.toThrow('Token validation service error');
    });

    test('should handle matchRefreshToken service throwing error', async () => {
      const mockConsumer = { id: 'consumer-123', accessToken: 'cached', refreshToken: 'cached' };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);
      mockConsumerService.matchRefreshToken.mockImplementation(() => {
        throw new Error('Refresh token validation failed');
      });

      await expect(async () => {
        await checkToken(req, res, next);
      }).rejects.toThrow('Refresh token validation failed');
    });
  });

  describe('Logging Verification', () => {
    test('should log consumer ID during validation', async () => {
      const consumerId = 'test-consumer-logging';
      req.decodedRefreshToken.iss = consumerId;
      mockConsumerService.getOne.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith(`Check token for consumer ${consumerId}`);
    });

    test('should log consumer data when found', async () => {
      const mockConsumer = {
        id: 'consumer-123',
        nickname: 'testuser',
        accessToken: 'token123',
        refreshToken: 'refresh123'
      };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);
      mockConsumerService.matchRefreshToken.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith(`Consumer found in cache : ${JSON.stringify(mockConsumer)}`);
    });

    test('should not log consumer data when not found', async () => {
      mockConsumerService.getOne.mockReturnValue(null);

      await checkToken(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledTimes(1);
      expect(mockLog.debug).toHaveBeenCalledWith('Check token for consumer consumer-123');
    });
  });

  describe('Integration Scenarios', () => {
    test('should work correctly in middleware chain context', async () => {
      const mockConsumer = {
        id: 'consumer-123',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        roles: ['user']
      };
      
      // Simulate previous middleware has already set some properties
      req.user = { id: 'previous-user' };
      req.isProtected = true;
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);
      mockConsumerService.matchRefreshToken.mockReturnValue(null);

      await checkToken(req, res, next);

      // Should add consumer without affecting other properties
      expect(req.consumer).toEqual(mockConsumer);
      expect(req.user).toEqual({ id: 'previous-user' }); // Unchanged
      expect(req.isProtected).toBe(true); // Unchanged
      expect(next).toHaveBeenCalledWith();
    });

    test('should handle concurrent validation scenarios', async () => {
      const mockConsumer = {
        id: 'consumer-concurrent',
        accessToken: 'concurrent-access',
        refreshToken: 'concurrent-refresh'
      };
      
      req.decodedRefreshToken.iss = 'consumer-concurrent';
      mockConsumerService.getOne.mockReturnValue(mockConsumer);
      mockConsumerService.matchAccessToken.mockReturnValue(null);
      mockConsumerService.matchRefreshToken.mockReturnValue(null);

      // Simulate multiple concurrent calls
      const promises = [
        checkToken(req, res, next),
        checkToken(req, res, next),
        checkToken(req, res, next)
      ];

      await Promise.all(promises);

      // All calls should succeed
      expect(next).toHaveBeenCalledTimes(3);
      expect(req.consumer).toEqual(mockConsumer);
    });
  });
});