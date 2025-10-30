/**
 * @jest-environment node
 */

// Mock dependencies before imports
jest.mock('@dwtechs/winstan');

const mockLog = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Set up mocks
require('@dwtechs/winstan').log = mockLog;

describe('UpdateHeaderWithConsumer Middleware', () => {
  let updateHeaderWithConsumer;
  let req, res, next;

  beforeAll(async () => {
    // Dynamically import the middleware
    const updateHeaderModule = await import('../../../src/middlewares/mappers/additionalHeaders.js');
    updateHeaderWithConsumer = updateHeaderModule.default;
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request object
    req = {
      isProtected: true,
      decodedAccessToken: {
        iss: 'consumer-123',
        sub: 'user-456',
        iat: 1640995200,
        exp: 1640998800
      }
    };
    
    // Setup response object with consumer data
    res = {
      rows: [
        {
          id: 'consumer-123',
          nickname: 'testuser',
          email: 'test@example.com',
          roles: ['user']
        }
      ]
    };
    
    // Setup next function
    next = jest.fn();
  });

  describe('Successful Header Addition', () => {
    test('should add additional headers when route is protected and token is valid', async () => {
      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-123',
        "x-consumer-name": 'testuser'
      });
      expect(next).toHaveBeenCalledWith();
      expect(mockLog.debug).toHaveBeenCalledWith(
        `updateHeaders(decodedAccessToken=${JSON.stringify(req.decodedAccessToken)})`
      );
    });

    test('should handle consumer with different nickname', async () => {
      res.rows[0].nickname = 'different_user';
      req.decodedAccessToken.iss = 'consumer-456';

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-456',
        "x-consumer-name": 'different_user'
      });
      expect(next).toHaveBeenCalledWith();
    });

    test('should handle consumer with special characters in nickname', async () => {
      res.rows[0].nickname = 'user@domain.com';
      req.decodedAccessToken.iss = 'special-consumer';

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'special-consumer',
        "x-consumer-name": 'user@domain.com'
      });
    });

    test('should handle numeric consumer ID', async () => {
      req.decodedAccessToken.iss = 12345;
      res.rows[0].nickname = 'numeric_user';

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 12345,
        "x-consumer-name": 'numeric_user'
      });
    });

    test('should handle complex consumer object', async () => {
      res.rows[0] = {
        id: 'complex-consumer',
        nickname: 'complex_user',
        email: 'complex@example.com',
        roles: ['admin', 'user'],
        profile: {
          firstName: 'John',
          lastName: 'Doe'
        },
        settings: {
          theme: 'dark',
          notifications: true
        }
      };
      req.decodedAccessToken.iss = 'complex-consumer';

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'complex-consumer',
        "x-consumer-name": 'complex_user'
      });
    });
  });

  describe('Unprotected Route Handling', () => {
    test('should skip processing when route is not protected', async () => {
      req.isProtected = false;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
      expect(mockLog.debug).not.toHaveBeenCalled();
    });

    test('should skip processing when isProtected is falsy', async () => {
      req.isProtected = null;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    test('should skip processing when isProtected is undefined', async () => {
      delete req.isProtected;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    test('should skip processing when isProtected is empty string', async () => {
      req.isProtected = '';

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    test('should skip processing when isProtected is zero', async () => {
      req.isProtected = 0;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Missing Token Issuer Handling', () => {
    test('should skip processing when decodedAccessToken.iss is missing', async () => {
      delete req.decodedAccessToken.iss;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
      expect(mockLog.debug).toHaveBeenCalledWith(
        `updateHeaders(decodedAccessToken=${JSON.stringify(req.decodedAccessToken)})`
      );
    });

    test('should skip processing when decodedAccessToken.iss is null', async () => {
      req.decodedAccessToken.iss = null;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    test('should skip processing when decodedAccessToken.iss is empty string', async () => {
      req.decodedAccessToken.iss = '';

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    test('should skip processing when decodedAccessToken.iss is undefined', async () => {
      req.decodedAccessToken.iss = undefined;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    test('should skip processing when decodedAccessToken.iss is false', async () => {
      req.decodedAccessToken.iss = false;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    test('should skip processing when decodedAccessToken.iss is zero', async () => {
      req.decodedAccessToken.iss = 0;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    test('should handle missing decodedAccessToken', async () => {
      delete req.decodedAccessToken;

      await expect(async () => {
        await updateHeaderWithConsumer(req, res, next);
      }).rejects.toThrow();
    });

    test('should handle null decodedAccessToken', async () => {
      req.decodedAccessToken = null;

      await expect(async () => {
        await updateHeaderWithConsumer(req, res, next);
      }).rejects.toThrow();
    });

    test('should handle missing res.rows', async () => {
      delete res.rows;

      await expect(async () => {
        await updateHeaderWithConsumer(req, res, next);
      }).rejects.toThrow();
    });

    test('should handle empty res.rows array', async () => {
      res.rows = [];

      await expect(async () => {
        await updateHeaderWithConsumer(req, res, next);
      }).rejects.toThrow();
    });

    test('should handle null res.rows', async () => {
      res.rows = null;

      await expect(async () => {
        await updateHeaderWithConsumer(req, res, next);
      }).rejects.toThrow();
    });

    test('should handle consumer without nickname', async () => {
      delete res.rows[0].nickname;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-123',
        "x-consumer-name": undefined
      });
      expect(next).toHaveBeenCalledWith();
    });

    test('should handle consumer with null nickname', async () => {
      res.rows[0].nickname = null;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-123',
        "x-consumer-name": null
      });
    });

    test('should handle consumer with empty string nickname', async () => {
      res.rows[0].nickname = '';

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-123',
        "x-consumer-name": ''
      });
    });

    test('should handle consumer with numeric nickname', async () => {
      res.rows[0].nickname = 12345;

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-123',
        "x-consumer-name": 12345
      });
    });
  });

  describe('Decoded Access Token Variations', () => {
    test('should handle complex decoded access token', async () => {
      req.decodedAccessToken = {
        iss: 'complex-issuer',
        sub: 'subject-123',
        aud: 'audience-456',
        iat: 1640995200,
        exp: 1640998800,
        scope: 'read write',
        roles: ['admin', 'user'],
        custom_claim: 'custom_value'
      };

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'complex-issuer',
        "x-consumer-name": 'testuser'
      });
      expect(mockLog.debug).toHaveBeenCalledWith(
        `updateHeaders(decodedAccessToken=${JSON.stringify(req.decodedAccessToken)})`
      );
    });

    test('should handle minimal decoded access token', async () => {
      req.decodedAccessToken = {
        iss: 'minimal-issuer'
      };

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'minimal-issuer',
        "x-consumer-name": 'testuser'
      });
    });

    test('should handle decoded access token with nested objects', async () => {
      req.decodedAccessToken = {
        iss: 'nested-issuer',
        user: {
          id: 123,
          profile: {
            name: 'John Doe',
            preferences: {
              theme: 'dark'
            }
          }
        }
      };

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'nested-issuer',
        "x-consumer-name": 'testuser'
      });
    });
  });

  describe('Consumer Data Variations', () => {
    test('should handle multiple consumers in res.rows (uses first one)', async () => {
      res.rows = [
        {
          id: 'consumer-1',
          nickname: 'first_user'
        },
        {
          id: 'consumer-2',
          nickname: 'second_user'
        }
      ];

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-123',
        "x-consumer-name": 'first_user'
      });
    });

    test('should handle consumer with additional properties', async () => {
      res.rows[0] = {
        id: 'detailed-consumer',
        nickname: 'detailed_user',
        email: 'detailed@example.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['admin', 'moderator'],
        permissions: ['read', 'write', 'delete'],
        metadata: {
          lastLogin: '2024-01-01',
          createdAt: '2023-01-01'
        }
      };

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-123',
        "x-consumer-name": 'detailed_user'
      });
    });
  });

  describe('Logging Verification', () => {
    test('should log decoded access token for protected routes', async () => {
      const expectedToken = {
        iss: 'log-test-consumer',
        sub: 'log-test-user'
      };
      req.decodedAccessToken = expectedToken;

      await updateHeaderWithConsumer(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith(
        `updateHeaders(decodedAccessToken=${JSON.stringify(expectedToken)})`
      );
    });

    test('should not log for unprotected routes', async () => {
      req.isProtected = false;

      await updateHeaderWithConsumer(req, res, next);

      expect(mockLog.debug).not.toHaveBeenCalled();
    });

    test('should log even when iss is missing', async () => {
      delete req.decodedAccessToken.iss;
      const expectedToken = {
        sub: 'user-456',
        iat: 1640995200,
        exp: 1640998800
      };
      req.decodedAccessToken = expectedToken;

      await updateHeaderWithConsumer(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith(
        `updateHeaders(decodedAccessToken=${JSON.stringify(expectedToken)})`
      );
    });

    test('should handle logging of complex token objects', async () => {
      const complexToken = {
        iss: 'complex-logger',
        nested: {
          data: {
            deep: 'value'
          }
        },
        array: [1, 2, 3],
        boolean: true,
        number: 123.45
      };
      req.decodedAccessToken = complexToken;

      await updateHeaderWithConsumer(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith(
        `updateHeaders(decodedAccessToken=${JSON.stringify(complexToken)})`
      );
    });
  });

  describe('Middleware Chain Integration', () => {
    test('should call next() after successful processing', async () => {
      await updateHeaderWithConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should call next() for unprotected routes', async () => {
      req.isProtected = false;

      await updateHeaderWithConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should call next() when iss is missing', async () => {
      delete req.decodedAccessToken.iss;

      await updateHeaderWithConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should preserve other request properties', async () => {
      req.method = 'POST';
      req.headers = { 'content-type': 'application/json' };
      req.body = { test: 'data' };
      req.customProperty = 'should-remain';

      await updateHeaderWithConsumer(req, res, next);

      expect(req.method).toBe('POST');
      expect(req.headers).toEqual({ 'content-type': 'application/json' });
      expect(req.body).toEqual({ test: 'data' });
      expect(req.customProperty).toBe('should-remain');
    });

    test('should overwrite existing additionalHeaders', async () => {
      req.additionalHeaders = {
        "x-existing-header": "existing-value"
      };

      await updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-123',
        "x-consumer-name": 'testuser'
      });
    });
  });

  describe('Concurrent Processing', () => {
    test('should handle concurrent requests', async () => {
      const req1 = {
        isProtected: true,
        decodedAccessToken: { iss: 'consumer-1' }
      };
      const req2 = {
        isProtected: true,
        decodedAccessToken: { iss: 'consumer-2' }
      };
      const req3 = {
        isProtected: false,
        decodedAccessToken: { iss: 'consumer-3' }
      };

      const res1 = { rows: [{ nickname: 'user1' }] };
      const res2 = { rows: [{ nickname: 'user2' }] };
      const res3 = { rows: [{ nickname: 'user3' }] };

      const promises = [
        updateHeaderWithConsumer(req1, res1, next),
        updateHeaderWithConsumer(req2, res2, next),
        updateHeaderWithConsumer(req3, res3, next)
      ];

      await Promise.all(promises);

      expect(req1.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-1',
        "x-consumer-name": 'user1'
      });
      expect(req2.additionalHeaders).toEqual({
        "x-consumer-id": 'consumer-2',
        "x-consumer-name": 'user2'
      });
      expect(req3.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(3);
    });
  });
});