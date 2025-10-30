/**
 * @jest-environment node
 */

// Mock dependencies before imports
jest.mock('@dwtechs/sparray');
jest.mock('@dwtechs/winstan');
jest.mock('../../../src/services/access.js');

const mockSparray = {
  getCommonValues: jest.fn()
};

const mockLog = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

const mockAccessService = {
  getOne: jest.fn()
};

// Set up mocks
require('@dwtechs/sparray').getCommonValues = mockSparray.getCommonValues;
require('@dwtechs/winstan').log = mockLog;
require('../../../src/services/access.js').default = mockAccessService;

describe('Check ACL Middleware', () => {
  let checkAcl;
  let req, res, next;

  beforeAll(async () => {
    // Dynamically import the middleware
    const checkAclModule = await import('../../../src/middlewares/validators/check-acl.js');
    checkAcl = checkAclModule.default;
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request object
    req = {
      isProtected: true,
      route: { id: 123 }
    };
    
    // Setup response object with user data
    res = {
      rows: [{
        id: 1,
        nickname: 'testuser',
        roles: ['user', 'editor']
      }]
    };
    
    // Setup next function
    next = jest.fn();
  });

  describe('Route Protection', () => {
    test('should skip ACL check for unprotected routes', async () => {
      req.isProtected = false;

      await checkAcl(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(mockAccessService.getOne).not.toHaveBeenCalled();
      expect(mockLog.debug).not.toHaveBeenCalled();
      expect(mockSparray.getCommonValues).not.toHaveBeenCalled();
    });
  });

  describe('User Validation', () => {
    test('should return 404 error when user not found in res.rows', async () => {
      res.rows = [];

      await checkAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 404,
        message: "User not found"
      });
      expect(mockAccessService.getOne).not.toHaveBeenCalled();
    });

    test('should return 404 error when res.rows is undefined', async () => {
      delete res.rows;

      await checkAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 404,
        message: "User not found"
      });
    });

    test('should return 404 error when first user is null', async () => {
      res.rows = [null];

      await checkAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 404,
        message: "User not found"
      });
    });
  });

  describe('Access Control Logic', () => {
    test('should allow access when route has no access restrictions', async () => {
      mockAccessService.getOne.mockReturnValue(null);

      await checkAcl(req, res, next);

      expect(mockAccessService.getOne).toHaveBeenCalledWith(123);
      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=123, consumerRoles=[user,editor], accessRoles=[undefined])'
      );
      expect(next).toHaveBeenCalledWith();
      expect(mockSparray.getCommonValues).not.toHaveBeenCalled();
    });

    test('should allow access when route exists but has no role restrictions', async () => {
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: null
      });

      await checkAcl(req, res, next);

      expect(mockAccessService.getOne).toHaveBeenCalledWith(123);
      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=123, consumerRoles=[user,editor], accessRoles=[undefined])'
      );
      expect(next).toHaveBeenCalledWith();
    });

    test('should allow access when user has required roles', async () => {
      const accessRoles = ['admin', 'editor', 'viewer'];
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: accessRoles
      });
      mockSparray.getCommonValues.mockReturnValue(['editor']); // User has 'editor' role

      await checkAcl(req, res, next);

      expect(mockAccessService.getOne).toHaveBeenCalledWith(123);
      expect(mockSparray.getCommonValues).toHaveBeenCalledWith(['user', 'editor'], accessRoles);
      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=123, consumerRoles=[user,editor], accessRoles=[admin,editor,viewer])'
      );
      expect(next).toHaveBeenCalledWith();
    });

    test('should deny access when user lacks required roles', async () => {
      const accessRoles = ['admin', 'superuser'];
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: accessRoles
      });
      mockSparray.getCommonValues.mockReturnValue([]); // No common roles

      await checkAcl(req, res, next);

      expect(mockAccessService.getOne).toHaveBeenCalledWith(123);
      expect(mockSparray.getCommonValues).toHaveBeenCalledWith(['user', 'editor'], accessRoles);
      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=123, consumerRoles=[user,editor], accessRoles=[admin,superuser])'
      );
      expect(next).toHaveBeenCalledWith({
        statusCode: 403,
        message: "Forbidden"
      });
    });
  });

  describe('User Role Variations', () => {
    test('should handle user with single role', async () => {
      res.rows[0].roles = ['admin'];
      const accessRoles = ['admin', 'editor'];
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: accessRoles
      });
      mockSparray.getCommonValues.mockReturnValue(['admin']);

      await checkAcl(req, res, next);

      expect(mockSparray.getCommonValues).toHaveBeenCalledWith(['admin'], accessRoles);
      expect(next).toHaveBeenCalledWith();
    });

    test('should handle user with no roles', async () => {
      res.rows[0].roles = [];
      const accessRoles = ['admin'];
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: accessRoles
      });
      mockSparray.getCommonValues.mockReturnValue([]);

      await checkAcl(req, res, next);

      expect(mockSparray.getCommonValues).toHaveBeenCalledWith([], accessRoles);
      expect(next).toHaveBeenCalledWith({
        statusCode: 403,
        message: "Forbidden"
      });
    });

    test('should handle user with null roles', async () => {
      res.rows[0].roles = null;
      const accessRoles = ['admin'];
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: accessRoles
      });
      mockSparray.getCommonValues.mockReturnValue([]);

      await checkAcl(req, res, next);

      expect(mockSparray.getCommonValues).toHaveBeenCalledWith(null, accessRoles);
      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=123, consumerRoles=[undefined], accessRoles=[admin])'
      );
      expect(next).toHaveBeenCalledWith({
        statusCode: 403,
        message: "Forbidden"
      });
    });

    test('should handle user with undefined roles', async () => {
      delete res.rows[0].roles;
      mockAccessService.getOne.mockReturnValue(null);

      await checkAcl(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=123, consumerRoles=[undefined], accessRoles=[undefined])'
      );
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Route ID Variations', () => {
    test('should handle string route ID', async () => {
      req.route.id = '456';
      mockAccessService.getOne.mockReturnValue(null);

      await checkAcl(req, res, next);

      expect(mockAccessService.getOne).toHaveBeenCalledWith('456');
      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=456, consumerRoles=[user,editor], accessRoles=[undefined])'
      );
    });

    test('should handle zero route ID', async () => {
      req.route.id = 0;
      mockAccessService.getOne.mockReturnValue(null);

      await checkAcl(req, res, next);

      expect(mockAccessService.getOne).toHaveBeenCalledWith(0);
      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=0, consumerRoles=[user,editor], accessRoles=[undefined])'
      );
    });

    test('should handle negative route ID', async () => {
      req.route.id = -1;
      mockAccessService.getOne.mockReturnValue(null);

      await checkAcl(req, res, next);

      expect(mockAccessService.getOne).toHaveBeenCalledWith(-1);
    });
  });

  describe('Access Service Integration', () => {
    test('should handle access service returning undefined', async () => {
      mockAccessService.getOne.mockReturnValue(undefined);

      await checkAcl(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should handle access service throwing error', async () => {
      mockAccessService.getOne.mockImplementation(() => {
        throw new Error('Service unavailable');
      });

      await expect(async () => {
        await checkAcl(req, res, next);
      }).rejects.toThrow('Service unavailable');
    });

    test('should handle complex access roles array', async () => {
      const complexRoles = ['super-admin', 'content-manager', 'api-user', 'readonly'];
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: complexRoles
      });
      mockSparray.getCommonValues.mockReturnValue(['api-user']);

      await checkAcl(req, res, next);

      expect(mockSparray.getCommonValues).toHaveBeenCalledWith(['user', 'editor'], complexRoles);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Logging Verification', () => {
    test('should log correct information with all parameters present', async () => {
      const accessRoles = ['admin', 'editor'];
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: accessRoles
      });
      mockSparray.getCommonValues.mockReturnValue(['editor']);

      await checkAcl(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=123, consumerRoles=[user,editor], accessRoles=[admin,editor])'
      );
    });

    test('should log correct information when roles are undefined', async () => {
      delete res.rows[0].roles;
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: null
      });

      await checkAcl(req, res, next);

      expect(mockLog.debug).toHaveBeenCalledWith(
        'checkAcl(routeId=123, consumerRoles=[undefined], accessRoles=[undefined])'
      );
    });
  });

  describe('Multiple Users Scenario', () => {
    test('should only check first user in res.rows array', async () => {
      res.rows = [
        { id: 1, roles: ['user'] },
        { id: 2, roles: ['admin'] }
      ];
      const accessRoles = ['admin'];
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: accessRoles
      });
      mockSparray.getCommonValues.mockReturnValue([]); // First user doesn't have admin role

      await checkAcl(req, res, next);

      expect(mockSparray.getCommonValues).toHaveBeenCalledWith(['user'], accessRoles);
      expect(next).toHaveBeenCalledWith({
        statusCode: 403,
        message: "Forbidden"
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing route object', async () => {
      delete req.route;

      await expect(async () => {
        await checkAcl(req, res, next);
      }).rejects.toThrow();
    });

    test('should handle missing route id', async () => {
      req.route = {};

      await checkAcl(req, res, next);

      expect(mockAccessService.getOne).toHaveBeenCalledWith(undefined);
    });

    test('should handle empty access roles array', async () => {
      mockAccessService.getOne.mockReturnValue({
        routeId: 123,
        rolesArrayAgg: []
      });
      mockSparray.getCommonValues.mockReturnValue([]);

      await checkAcl(req, res, next);

      expect(mockSparray.getCommonValues).toHaveBeenCalledWith(['user', 'editor'], []);
      expect(next).toHaveBeenCalledWith({
        statusCode: 403,
        message: "Forbidden"
      });
    });
  });
});