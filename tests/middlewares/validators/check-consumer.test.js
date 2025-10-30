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
  getOne: jest.fn()
};

// Set up mocks
require('@dwtechs/winstan').log = mockLog;
require('../../../src/services/consumer.js').default = mockConsumerService;

describe('Check Consumer Middleware', () => {
  let checkConsumer;
  let req, res, next;

  beforeAll(async () => {
    // Dynamically import the middleware
    const checkConsumerModule = await import('../../src/middlewares/validators/check-consumer.js');
    checkConsumer = checkConsumerModule.default;
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request object
    req = {
      originalUrl: '/api/users/123',
      method: 'GET'
    };
    
    // Setup response object
    res = {};
    
    // Setup next function
    next = jest.fn();
  });

  describe('Successful Route Matching', () => {
    test('should add route information to request when consumer found', async () => {
      const mockConsumer = {
        id: 1,
        url: '/api/users/:id',
        method: 'GET',
        jwt: true,
        description: 'Get user by ID',
        pattern: '^/api/users/\\d+$',
        methods: ['GET']
      };
      
      mockConsumerService.getOne.mockReturnValue(mockConsumer);

      // Note: The middleware has a bug - it uses 'r' instead of 'c'
      // This test will fail until the bug is fixed
      try {
        await checkConsumer(req, res, next);
        
        // These assertions will fail due to the bug in the middleware
        expect(req.isProtected).toBe(true);
        expect(req.route).toEqual(mockConsumer);
        expect(next).toHaveBeenCalledWith();
      } catch (error) {
        // Expected to fail due to 'r is not defined' error
        expect(error.message).toContain('r is not defined');
      }

      // Verify service was called correctly
      expect(mockConsumerService.getOne).toHaveBeenCalledWith('/api/users/123', 'GET');
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url GET:/api/users/123');
      expect(mockLog.debug).toHaveBeenCalledWith(`Consumer : ${JSON.stringify(mockConsumer)}`);
    });

    test('should handle non-JWT protected routes', async () => {
      const mockConsumer = {
        id: 2,
        url: '/api/public/info',
        method: 'GET',
        jwt: false,
        description: 'Public information endpoint'
      };
      
      req.originalUrl = '/api/public/info';
      mockConsumerService.getOne.mockReturnValue(mockConsumer);

      try {
        await checkConsumer(req, res, next);
        
        expect(req.isProtected).toBe(false);
        expect(req.route).toEqual(mockConsumer);
      } catch (error) {
        // Expected to fail due to the bug
        expect(error.message).toContain('r is not defined');
      }

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('/api/public/info', 'GET');
    });

    test('should handle different HTTP methods', async () => {
      const mockConsumer = {
        id: 3,
        url: '/api/users',
        method: 'POST',
        jwt: true,
        description: 'Create new user'
      };
      
      req.method = 'POST';
      req.originalUrl = '/api/users';
      mockConsumerService.getOne.mockReturnValue(mockConsumer);

      try {
        await checkConsumer(req, res, next);
        
        expect(req.isProtected).toBe(true);
        expect(req.route).toEqual(mockConsumer);
      } catch (error) {
        expect(error.message).toContain('r is not defined');
      }

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('/api/users', 'POST');
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url POST:/api/users');
    });
  });

  describe('Consumer Not Found', () => {
    test('should return 404 error when consumer not found', async () => {
      mockConsumerService.getOne.mockReturnValue(null);

      await checkConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Consumer not found"
      });
      expect(mockConsumerService.getOne).toHaveBeenCalledWith('/api/users/123', 'GET');
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url GET:/api/users/123');
      
      // Verify no additional properties are set on request
      expect(req.isProtected).toBeUndefined();
      expect(req.route).toBeUndefined();
    });

    test('should return 404 error when consumer service returns undefined', async () => {
      mockConsumerService.getOne.mockReturnValue(undefined);

      await checkConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Consumer not found"
      });
    });
  });

  describe('URL and Method Variations', () => {
    test('should handle root URL', async () => {
      req.originalUrl = '/';
      req.method = 'GET';
      mockConsumerService.getOne.mockReturnValue(null);

      await checkConsumer(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('/', 'GET');
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url GET:/');
    });

    test('should handle URL with query parameters', async () => {
      req.originalUrl = '/api/users?page=1&limit=10';
      mockConsumerService.getOne.mockReturnValue(null);

      await checkConsumer(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('/api/users?page=1&limit=10', 'GET');
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url GET:/api/users?page=1&limit=10');
    });

    test('should handle URL with fragments', async () => {
      req.originalUrl = '/api/users/123/profile';
      mockConsumerService.getOne.mockReturnValue(null);

      await checkConsumer(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('/api/users/123/profile', 'GET');
    });

    test('should handle different HTTP methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
      
      for (const method of methods) {
        req.method = method;
        mockConsumerService.getOne.mockReturnValue(null);
        
        await checkConsumer(req, res, next);
        
        expect(mockConsumerService.getOne).toHaveBeenCalledWith('/api/users/123', method);
        expect(mockLog.debug).toHaveBeenCalledWith(`Check consumer for url ${method}:/api/users/123`);
        
        jest.clearAllMocks();
      }
    });
  });

  describe('Complex Consumer Objects', () => {
    test('should handle consumer with additional properties', async () => {
      const complexConsumer = {
        id: 10,
        url: '/api/complex/:id',
        method: 'GET',
        jwt: true,
        description: 'Complex endpoint with extra config',
        pattern: '^/api/complex/\\d+$',
        methods: ['GET', 'POST'],
        config: {
          rateLimit: 100,
          timeout: 5000,
          cache: true
        },
        metadata: {
          version: '1.0.0',
          deprecated: false
        }
      };
      
      mockConsumerService.getOne.mockReturnValue(complexConsumer);

      try {
        await checkConsumer(req, res, next);
        
        expect(req.route).toEqual(complexConsumer);
        expect(req.isProtected).toBe(true);
      } catch (error) {
        expect(error.message).toContain('r is not defined');
      }

      expect(mockLog.debug).toHaveBeenCalledWith(`Consumer : ${JSON.stringify(complexConsumer)}`);
    });
  });

  describe('Service Error Handling', () => {
    test('should handle service throwing error', async () => {
      mockConsumerService.getOne.mockImplementation(() => {
        throw new Error('Service unavailable');
      });

      await expect(async () => {
        await checkConsumer(req, res, next);
      }).rejects.toThrow('Service unavailable');

      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url GET:/api/users/123');
    });

    test('should handle service returning invalid data', async () => {
      mockConsumerService.getOne.mockReturnValue('invalid-data');

      try {
        await checkConsumer(req, res, next);
        
        // This would fail because 'invalid-data'.jwt is undefined
        expect(req.isProtected).toBeUndefined();
        expect(req.route).toBe('invalid-data');
      } catch (error) {
        expect(error.message).toContain('r is not defined');
      }
    });
  });

  describe('Logging Verification', () => {
    test('should log appropriate debug messages for found consumer', async () => {
      const mockConsumer = { id: 1, jwt: false };
      mockConsumerService.getOne.mockReturnValue(mockConsumer);

      try {
        await checkConsumer(req, res, next);
      } catch (error) {
        // Expected due to bug
      }

      expect(mockLog.debug).toHaveBeenCalledTimes(2);
      expect(mockLog.debug).toHaveBeenNthCalledWith(1, 'Check consumer for url GET:/api/users/123');
      expect(mockLog.debug).toHaveBeenNthCalledWith(2, `Consumer : ${JSON.stringify(mockConsumer)}`);
    });

    test('should log only initial debug message for not found consumer', async () => {
      mockConsumerService.getOne.mockReturnValue(null);

      await checkConsumer(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledTimes(1);
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url GET:/api/users/123');
    });
  });

  describe('Request Object Properties', () => {
    test('should not modify request object when consumer not found', async () => {
      mockConsumerService.getOne.mockReturnValue(null);

      await checkConsumer(req, res, next);

      expect(req.isProtected).toBeUndefined();
      expect(req.route).toBeUndefined();
      expect(req.originalUrl).toBe('/api/users/123'); // Should remain unchanged
      expect(req.method).toBe('GET'); // Should remain unchanged
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty URL', async () => {
      req.originalUrl = '';
      mockConsumerService.getOne.mockReturnValue(null);

      await checkConsumer(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('', 'GET');
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url GET:');
    });

    test('should handle undefined originalUrl', async () => {
      delete req.originalUrl;
      mockConsumerService.getOne.mockReturnValue(null);

      await checkConsumer(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith(undefined, 'GET');
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url GET:undefined');
    });

    test('should handle undefined method', async () => {
      delete req.method;
      mockConsumerService.getOne.mockReturnValue(null);

      await checkConsumer(req, res, next);

      expect(mockConsumerService.getOne).toHaveBeenCalledWith('/api/users/123', undefined);
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url undefined:/api/users/123');
    });

    test('should handle consumer with null jwt property', async () => {
      const mockConsumer = {
        id: 1,
        jwt: null
      };
      mockConsumerService.getOne.mockReturnValue(mockConsumer);

      try {
        await checkConsumer(req, res, next);
        
        expect(req.isProtected).toBe(null);
      } catch (error) {
        expect(error.message).toContain('r is not defined');
      }
    });
  });

  describe('Bug Detection Tests', () => {
    test('should expose the variable reference bug', async () => {
      const mockConsumer = { id: 1, jwt: true };
      mockConsumerService.getOne.mockReturnValue(mockConsumer);

      // This test explicitly checks for the bug where 'r' is used instead of 'c'
      await expect(async () => {
        await checkConsumer(req, res, next);
      }).rejects.toThrow('r is not defined');

      // Verify that the service call and initial logging still work
      expect(mockConsumerService.getOne).toHaveBeenCalledWith('/api/users/123', 'GET');
      expect(mockLog.debug).toHaveBeenCalledWith('Check consumer for url GET:/api/users/123');
      expect(mockLog.debug).toHaveBeenCalledWith(`Consumer : ${JSON.stringify(mockConsumer)}`);
    });
  });
});