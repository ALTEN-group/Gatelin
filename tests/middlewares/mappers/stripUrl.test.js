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

describe('Strip URL Middleware', () => {
  let stripUrl;
  let req, res, next;

  beforeAll(async () => {
    // Dynamically import the middleware
    const stripUrlModule = await import('../../../src/middlewares/mappers/stripUrl.js');
    stripUrl = stripUrlModule.default;
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request object
    req = {
      originalUrl: '/api/users/123/profile',
      url: '/api/users/123/profile', // Initial URL same as originalUrl
      route: {
        pattern: '~^/api/users'
      }
    };
    
    // Setup response object
    res = {};
    
    // Setup next function
    next = jest.fn();
  });

  describe('Regex Pattern Stripping', () => {
    test('should strip regex pattern from beginning of URL', async () => {
      req.originalUrl = '/api/users/123/profile';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/123/profile');
      expect(next).toHaveBeenCalledWith();
      expect(mockLog.debug).toHaveBeenCalledWith('stripUrl(originalUrl=/api/users/123/profile, pattern=~^/api/users)');
      expect(mockLog.debug).toHaveBeenCalledWith('stripped Url : /123/profile');
    });

    test('should strip complex regex pattern', async () => {
      req.originalUrl = '/api/v1/users/123/settings';
      req.route.pattern = '~^/api/v\\d+/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/123/settings');
      expect(mockLog.debug).toHaveBeenCalledWith('stripUrl(originalUrl=/api/v1/users/123/settings, pattern=~^/api/v\\d+/users)');
      expect(mockLog.debug).toHaveBeenCalledWith('stripped Url : /123/settings');
    });

    test('should strip pattern with special regex characters', async () => {
      req.originalUrl = '/api/users.json';
      req.route.pattern = '~^/api/users\\.json';

      await stripUrl(req, res, next);

      expect(req.url).toBe('');
      expect(mockLog.debug).toHaveBeenCalledWith('stripped Url : ');
    });

    test('should handle pattern that matches multiple times', async () => {
      req.originalUrl = '/test/test/data';
      req.route.pattern = '~/test';

      await stripUrl(req, res, next);

      // Only first match should be replaced
      expect(req.url).toBe('/test/data');
    });

    test('should handle global regex pattern', async () => {
      req.originalUrl = '/api/users/api/data';
      req.route.pattern = '~/api';

      await stripUrl(req, res, next);

      // Only first occurrence should be replaced (default regex behavior)
      expect(req.url).toBe('/users/api/data');
    });

    test('should handle pattern with anchors', async () => {
      req.originalUrl = '/api/users/123';
      req.route.pattern = '~^/api';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/users/123');
    });

    test('should handle pattern that does not match', async () => {
      req.originalUrl = '/different/path/123';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      // Should remain unchanged if pattern doesn't match
      expect(req.url).toBe('/different/path/123');
    });

    test('should handle empty result after stripping', async () => {
      req.originalUrl = '/api/users';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('');
      expect(mockLog.debug).toHaveBeenCalledWith('stripped Url : ');
    });

    test('should handle URL with query parameters', async () => {
      req.originalUrl = '/api/users/123?limit=10&offset=0';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/123?limit=10&offset=0');
    });

    test('should handle URL with fragments', async () => {
      req.originalUrl = '/api/users/123#section';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/123#section');
    });

    test('should handle URL with encoded characters', async () => {
      req.originalUrl = '/api/users/john%20doe';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/john%20doe');
    });
  });

  describe('Non-Regex Pattern Handling', () => {
    test('should not strip non-regex pattern', async () => {
      req.originalUrl = '/api/users/123';
      req.route.pattern = '/api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users/123');
      expect(mockLog.debug).toHaveBeenCalledWith('stripUrl(originalUrl=/api/users/123, pattern=/api/users)');
      expect(mockLog.debug).toHaveBeenCalledWith('stripped Url : /api/users/123');
    });

    test('should handle empty non-regex pattern', async () => {
      req.originalUrl = '/api/users/123';
      req.route.pattern = '';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users/123');
    });

    test('should handle non-regex pattern with special characters', async () => {
      req.originalUrl = '/api/users.json';
      req.route.pattern = '/api/users.json';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users.json');
    });

    test('should handle single character non-regex pattern', async () => {
      req.originalUrl = '/api/users';
      req.route.pattern = 'a';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty original URL', async () => {
      req.originalUrl = '';
      req.route.pattern = '~^/api';

      await stripUrl(req, res, next);

      expect(req.url).toBe('');
      expect(mockLog.debug).toHaveBeenCalledWith('stripUrl(originalUrl=, pattern=~^/api)');
    });

    test('should handle root URL', async () => {
      req.originalUrl = '/';
      req.route.pattern = '~^/';

      await stripUrl(req, res, next);

      expect(req.url).toBe('');
    });

    test('should handle undefined original URL', async () => {
      delete req.originalUrl;
      req.route.pattern = '~^/api';

      await stripUrl(req, res, next);

      expect(req.url).toBe(undefined);
      expect(mockLog.debug).toHaveBeenCalledWith('stripUrl(originalUrl=undefined, pattern=~^/api)');
    });

    test('should handle null original URL', async () => {
      req.originalUrl = null;
      req.route.pattern = '~^/api';

      await stripUrl(req, res, next);

      expect(req.url).toBe(null);
    });

    test('should handle missing route object', async () => {
      delete req.route;

      await expect(async () => {
        await stripUrl(req, res, next);
      }).rejects.toThrow();
    });

    test('should handle missing pattern in route', async () => {
      delete req.route.pattern;

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users/123/profile');
      expect(mockLog.debug).toHaveBeenCalledWith('stripUrl(originalUrl=/api/users/123/profile, pattern=undefined)');
    });

    test('should handle null pattern', async () => {
      req.route.pattern = null;

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users/123/profile');
    });

    // test('should handle numeric pattern', async () => {
    //   req.route.pattern = 123;

    //   await stripUrl(req, res, next);

    //   expect(req.url).toBe('/api/users/123/profile');
    // });
  });

  describe('Complex Regex Patterns', () => {
    test('should handle pattern with character classes', async () => {
      req.originalUrl = '/api/users123/profile';
      req.route.pattern = '~^/api/users[0-9]+';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/profile');
    });

    test('should handle pattern with quantifiers', async () => {
      req.originalUrl = '/api/v1.2.3/users';
      req.route.pattern = '~^/api/v\\d+\\.\\d+\\.\\d+';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/users');
    });

    test('should handle pattern with alternation', async () => {
      req.originalUrl = '/api/users/data';
      req.route.pattern = '~^/api/(users|clients)';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/data');
    });

    test('should handle pattern with optional groups', async () => {
      req.originalUrl = '/api/v1/users/data';
      req.route.pattern = '~^/api(/v\\d+)?/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/data');
    });

    test('should handle pattern with word boundaries', async () => {
      req.originalUrl = '/api/users_admin/data';
      req.route.pattern = '~^/api/users\\b';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users_admin/data');
    });

    test('should handle case-sensitive pattern', async () => {
      req.originalUrl = '/API/users/data';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      // Should not match due to case sensitivity
      expect(req.url).toBe('/API/users/data');
    });
  });

  describe('URL Variations', () => {
    test('should handle URL with double slashes', async () => {
      req.originalUrl = '/api//users//123';
      req.route.pattern = '~^/api';

      await stripUrl(req, res, next);

      expect(req.url).toBe('//users//123');
    });

    test('should handle URL with trailing slash', async () => {
      req.originalUrl = '/api/users/';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/');
    });

    test('should handle URL without leading slash', async () => {
      req.originalUrl = 'api/users/123';
      req.route.pattern = '~^api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/123');
    });

    test('should handle very long URL', async () => {
      const longPath = '/path'.repeat(100);
      req.originalUrl = `/api/users${longPath}`;
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe(longPath);
    });

    test('should handle URL with special characters', async () => {
      req.originalUrl = '/api/users/@john-doe_123/profile';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/@john-doe_123/profile');
    });
  });

  describe('Pattern Edge Cases', () => {
    test('should handle pattern starting with ~ but empty regex', async () => {
      req.originalUrl = '/api/users/123';
      req.route.pattern = '~';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users/123');
    });

    test('should handle multiple ~ characters in pattern', async () => {
      req.originalUrl = '/api/users/123';
      req.route.pattern = '~~^/api';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users/123');
    });

    test('should handle pattern with only ~', async () => {
      req.originalUrl = '/api/users/123';
      req.route.pattern = '~';

      await stripUrl(req, res, next);

      expect(req.url).toBe('/api/users/123');
    });

    test('should handle invalid regex pattern gracefully', async () => {
      req.originalUrl = '/api/users/123';
      req.route.pattern = '~^[invalid';

      await expect(async () => {
        await stripUrl(req, res, next);
      }).rejects.toThrow();
    });
  });

  describe('Logging Verification', () => {
    test('should log input parameters', async () => {
      req.originalUrl = '/test/url';
      req.route.pattern = '~^/test';

      await stripUrl(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith('stripUrl(originalUrl=/test/url, pattern=~^/test)');
    });

    test('should log resulting stripped URL', async () => {
      req.originalUrl = '/api/users/123';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith('stripped Url : /123');
    });

    test('should log both debug messages in correct order', async () => {
      req.originalUrl = '/api/data';
      req.route.pattern = '~^/api';

      await stripUrl(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledTimes(2);
      expect(mockLog.debug).toHaveBeenNthCalledWith(1, 'stripUrl(originalUrl=/api/data, pattern=~^/api)');
      expect(mockLog.debug).toHaveBeenNthCalledWith(2, 'stripped Url : /data');
    });

    test('should handle logging with undefined values', async () => {
      req.originalUrl = undefined;
      req.route.pattern = undefined;

      await stripUrl(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith('stripUrl(originalUrl=undefined, pattern=undefined)');
    });
  });

  describe('Middleware Chain Integration', () => {
    test('should call next() after processing', async () => {
      await stripUrl(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should not modify originalUrl', async () => {
      const originalUrl = '/api/users/123';
      req.originalUrl = originalUrl;
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      expect(req.originalUrl).toBe(originalUrl);
      expect(req.url).toBe('/123');
    });

    test('should preserve other request properties', async () => {
      req.method = 'GET';
      req.headers = { 'content-type': 'application/json' };
      req.body = { test: 'data' };
      req.customProperty = 'should-remain';

      await stripUrl(req, res, next);

      expect(req.method).toBe('GET');
      expect(req.headers).toEqual({ 'content-type': 'application/json' });
      expect(req.body).toEqual({ test: 'data' });
      expect(req.customProperty).toBe('should-remain');
    });

    test('should work with existing url property', async () => {
      req.url = '/existing/url';
      req.originalUrl = '/api/users/123';
      req.route.pattern = '~^/api/users';

      await stripUrl(req, res, next);

      // Should overwrite existing url property
      expect(req.url).toBe('/123');
    });
  });

  describe('Performance Edge Cases', () => {
    test('should handle concurrent requests', async () => {
      const req1 = { originalUrl: '/api/users/1', route: { pattern: '~^/api/users' } };
      const req2 = { originalUrl: '/api/users/2', route: { pattern: '~^/api/users' } };
      const req3 = { originalUrl: '/api/clients/3', route: { pattern: '~^/api/clients' } };

      const promises = [
        stripUrl(req1, res, next),
        stripUrl(req2, res, next),
        stripUrl(req3, res, next)
      ];

      await Promise.all(promises);

      expect(req1.url).toBe('/1');
      expect(req2.url).toBe('/2');
      expect(req3.url).toBe('/3');
      expect(next).toHaveBeenCalledTimes(3);
    });
  });
});