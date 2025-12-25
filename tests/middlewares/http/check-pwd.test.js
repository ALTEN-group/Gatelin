/**
 * @jest-environment node
 */

// Set up environment variable before any imports
process.env.MSAUTH_URL = 'https://auth.example.com';

// Mock dependencies before imports
jest.mock('httpclient');

const mockHttpclient = {
  query: jest.fn()
};

// Set up mocks
require('httpclient').default = mockHttpclient;

describe('Check Password Middleware', () => {
  let checkPwd;
  let req, res, next;

  beforeAll(async () => {
    // Dynamically import the middleware
    const checkPwdModule = await import('../../../src/middlewares/http/check-pwd.js');
    checkPwd = checkPwdModule.default;
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request object
    req = {
      body: {
        rows: [
          {
            userId: 1,
            pwHash: 'testpassword'
          }
        ]
      },
      additionalHeaders: {
        'x-consumer-id': 'consumer123',
        'x-consumer-username': 'testuser'
      }
    };
    
    // Setup response object
    res = {};
    
    // Setup next function
    next = jest.fn();
  });

  afterAll(() => {
    // Clean up environment variable
    delete process.env.MSAUTH_URL;
  });

  describe('Successful Authentication', () => {
    test('should call next() when authentication succeeds', async () => {
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://auth.example.com/login/',
        null,
        {
          filters: {
            userId: { value: 1, matchMode: 'equals' },
            pwHash: { value: 'testpassword', matchMode: 'equals' }
          }
        },
        req.additionalHeaders
      );
      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should handle authentication with different body data', async () => {
      req.body = {
        rows: [
          {
            userId: 2,
            pwHash: 'adminpass123'
          }
        ]
      };
      mockHttpclient.query.mockResolvedValue({ token: 'jwt-token' });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://auth.example.com/login/',
        null,
        {
          filters: {
            userId: { value: 2, matchMode: 'equals' },
            pwHash: { value: 'adminpass123', matchMode: 'equals' }
          }
        },
        req.additionalHeaders
      );
      expect(next).toHaveBeenCalledWith();
    });

    test('should handle authentication with custom headers', async () => {
      req.additionalHeaders = {
        'x-consumer-id': 'special-consumer',
        'x-api-version': 'v2',
        'authorization': 'Bearer temp-token'
      };
      mockHttpclient.query.mockResolvedValue({ authenticated: true });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://auth.example.com/login/',
        null,
        {
          filters: {
            userId: { value: 1, matchMode: 'equals' },
            pwHash: { value: 'testpassword', matchMode: 'equals' }
          }
        },
        req.additionalHeaders
      );
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Authentication Failures', () => {
    test('should call next with error when authentication fails', (done) => {
      const authError = new Error('Invalid credentials');
      mockHttpclient.query.mockRejectedValue(authError);

      next.mockImplementation((error) => {
        expect(mockHttpclient.query).toHaveBeenCalledWith(
          'POST',
          'https://auth.example.com/login/',
          null,
          {
            filters: {
              userId: { value: 1, matchMode: 'equals' },
              pwHash: { value: 'testpassword', matchMode: 'equals' }
            }
          },
          req.additionalHeaders
        );
        expect(error).toBe(authError);
        done();
      });

      checkPwd(req, res, next);
    });

    test('should handle network errors', (done) => {
      const networkError = new Error('Network timeout');
      networkError.code = 'NETWORK_ERROR';
      mockHttpclient.query.mockRejectedValue(networkError);

      next.mockImplementation((error) => {
        expect(error).toBe(networkError);
        done();
      });

      checkPwd(req, res, next);
    });

    test('should handle HTTP errors with status codes', (done) => {
      const httpError = new Error('Unauthorized');
      httpError.statusCode = 401;
      mockHttpclient.query.mockRejectedValue(httpError);

      next.mockImplementation((error) => {
        expect(error).toBe(httpError);
        expect(error.statusCode).toBe(401);
        done();
      });

      checkPwd(req, res, next);
    });

    test('should handle service unavailable errors', (done) => {
      const serviceError = new Error('Service Unavailable');
      serviceError.statusCode = 503;
      mockHttpclient.query.mockRejectedValue(serviceError);

      next.mockImplementation((error) => {
        expect(error).toBe(serviceError);
        expect(error.statusCode).toBe(503);
        done();
      });

      checkPwd(req, res, next);
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing additionalHeaders', async () => {
      delete req.additionalHeaders;
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://auth.example.com/login/',
        null,
        {
          filters: {
            userId: { value: 1, matchMode: 'equals' },
            pwHash: { value: 'testpassword', matchMode: 'equals' }
          }
        },
        {}
      );
      expect(next).toHaveBeenCalledWith();
    });

    test('should handle null additionalHeaders', async () => {
      req.additionalHeaders = null;
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://auth.example.com/login/',
        null,
        {
          filters: {
            userId: { value: 1, matchMode: 'equals' },
            pwHash: { value: 'testpassword', matchMode: 'equals' }
          }
        },
        {}
      );
      expect(next).toHaveBeenCalledWith();
    });

    test('should throw error when rows is missing', async () => {
      req.body = {};
      
      expect(() => checkPwd(req, res, next)).toThrow();
    });

    test('should throw error when body is null', async () => {
      req.body = null;
      
      expect(() => checkPwd(req, res, next)).toThrow();
    });

    test('should throw error when body is undefined', async () => {
      delete req.body;
      
      expect(() => checkPwd(req, res, next)).toThrow();
    });
  });

  describe('Environment Configuration', () => {
    test('should use MSAUTH_URL from environment', async () => {
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://auth.example.com/login/',
        null,
        {
          filters: {
            userId: { value: 1, matchMode: 'equals' },
            pwHash: { value: 'testpassword', matchMode: 'equals' }
          }
        },
        req.additionalHeaders
      );
      expect(next).toHaveBeenCalledWith();
    });

    test('should construct correct URL with MSAUTH_URL', async () => {
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        expect.stringContaining('https://auth.example.com/login/'),
        null,
        req.body,
        req.additionalHeaders
      );
      expect(next).toHaveBeenCalledWith();
    });

    test('should build login endpoint URL correctly', async () => {
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      const callArgs = mockHttpclient.query.mock.calls[0];
      expect(callArgs[1]).toBe('https://auth.example.com/login/');
    });
  });

  describe('HTTP Client Integration', () => {
    test('should call httpclient.query with correct parameters', async () => {
      mockHttpclient.query.mockResolvedValue({ data: 'response' });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledTimes(1);
      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        expect.stringContaining('/login/'),
        null,
        {
          filters: {
            userId: { value: 1, matchMode: 'equals' },
            pwHash: { value: 'testpassword', matchMode: 'equals' }
          }
        },
        req.additionalHeaders
      );
    });

    test('should handle complex request body', async () => {
      req.body = {
        rows: [
          {
            userId: 5,
            pwHash: 'complexPassword123!'
          }
        ]
      };
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://auth.example.com/login/',
        null,
        {
          filters: {
            userId: { value: 5, matchMode: 'equals' },
            pwHash: { value: 'complexPassword123!', matchMode: 'equals' }
          }
        },
        req.additionalHeaders
      );
      expect(next).toHaveBeenCalledWith();
    });

    test('should handle complex additional headers', async () => {
      req.additionalHeaders = {
        'x-consumer-id': 'consumer-123',
        'x-consumer-username': 'testuser',
        'x-forwarded-for': '192.168.1.1',
        'user-agent': 'Mozilla/5.0 Test Browser',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': 'Bearer temp-access-token'
      };
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      expect(mockHttpclient.query).toHaveBeenCalledWith(
        'POST',
        'https://auth.example.com/login/',
        null,
        {
          filters: {
            userId: { value: 1, matchMode: 'equals' },
            pwHash: { value: 'testpassword', matchMode: 'equals' }
          }
        },
        req.additionalHeaders
      );
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Middleware Chain Integration', () => {
    test('should not modify request or response objects', async () => {
      const originalReq = { ...req };
      const originalRes = { ...res };
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      expect(req).toEqual(originalReq);
      expect(res).toEqual(originalRes);
    });

    test('should preserve other request properties', async () => {
      req.method = 'POST';
      req.url = '/auth/login';
      req.headers = { 'content-type': 'application/json' };
      req.customProperty = 'should-remain';
      mockHttpclient.query.mockResolvedValue({ success: true });

      await checkPwd(req, res, next);

      expect(req.method).toBe('POST');
      expect(req.url).toBe('/auth/login');
      expect(req.headers).toEqual({ 'content-type': 'application/json' });
      expect(req.customProperty).toBe('should-remain');
    });
  });

  describe('Concurrent Processing', () => {
    test('should handle concurrent requests', async () => {
      const req1 = { ...req, body: { rows: [{ userId: 1, pwHash: 'pass1' }] } };
      const req2 = { ...req, body: { rows: [{ userId: 2, pwHash: 'pass2' }] } };
      const req3 = { ...req, body: { rows: [{ userId: 3, pwHash: 'pass3' }] } };

      mockHttpclient.query.mockResolvedValue({ success: true });

      const promises = [
        checkPwd(req1, res, next),
        checkPwd(req2, res, next),
        checkPwd(req3, res, next)
      ];

      await Promise.all(promises);

      expect(mockHttpclient.query).toHaveBeenCalledTimes(3);
      expect(next).toHaveBeenCalledTimes(3);
      expect(next).toHaveBeenCalledWith();
    });
  });
});