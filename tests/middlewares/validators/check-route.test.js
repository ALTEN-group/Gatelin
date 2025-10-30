/**
 * @jest-environment node
 */

import checkRoute from '../../../src/middlewares/validators/check-route.js';
import routeSvc from '../../../src/services/route.js';
import { log } from '@dwtechs/winstan';

jest.mock('../../../src/services/route.js');
jest.mock('@dwtechs/winstan');

describe('checkRoute middleware', () => {
  let req, res, next, mockRouteSvc, mockLog;

  beforeEach(() => {
    req = {
      originalUrl: '/api/users',
      method: 'GET'
    };
    res = {};
    next = jest.fn();
    
    mockRouteSvc = {
      getOne: jest.fn()
    };
    routeSvc.getOne = mockRouteSvc.getOne;
    
    mockLog = {
      debug: jest.fn()
    };
    log.debug = mockLog.debug;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate protected route and add route data to request', () => {
    const mockRoute = {
      id: 1,
      url: '/api/users',
      method: 'GET',
      jwt: true,
      description: 'Get all users',
      config: { roles: ['admin'] }
    };
    
    mockRouteSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(mockRouteSvc.getOne).toHaveBeenCalledWith('/api/users', 'GET');
    expect(mockLog.debug).toHaveBeenCalledWith('Check route for url GET:/api/users');
    expect(mockLog.debug).toHaveBeenCalledWith(`Route : ${JSON.stringify(mockRoute)}`);
    expect(mockLog.debug).toHaveBeenCalledWith('isProtected : true');
    
    expect(req.isProtected).toBe(true);
    expect(req.route).toEqual(mockRoute);
    expect(next).toHaveBeenCalledWith();
  });

  it('should validate unprotected route and add route data to request', () => {
    const mockRoute = {
      id: 2,
      url: '/api/health',
      method: 'GET',
      jwt: false,
      description: 'Health check endpoint'
    };
    
    mockRouteSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(mockRouteSvc.getOne).toHaveBeenCalledWith('/api/users', 'GET');
    expect(mockLog.debug).toHaveBeenCalledWith('isProtected : false');
    
    expect(req.isProtected).toBe(false);
    expect(req.route).toEqual(mockRoute);
    expect(next).toHaveBeenCalledWith();
  });

  it('should handle POST route validation', () => {
    req.originalUrl = '/api/users';
    req.method = 'POST';
    
    const mockRoute = {
      id: 3,
      url: '/api/users',
      method: 'POST',
      jwt: true,
      description: 'Create user'
    };
    
    mockRouteSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(mockRouteSvc.getOne).toHaveBeenCalledWith('/api/users', 'POST');
    expect(mockLog.debug).toHaveBeenCalledWith('Check route for url POST:/api/users');
    expect(req.isProtected).toBe(true);
    expect(req.route).toEqual(mockRoute);
  });

  it('should handle route not found and return 404', () => {
    mockRouteSvc.getOne.mockReturnValue(null);

    checkRoute(req, res, next);

    expect(mockRouteSvc.getOne).toHaveBeenCalledWith('/api/users', 'GET');
    expect(mockLog.debug).toHaveBeenCalledWith('Check route for url GET:/api/users');
    expect(next).toHaveBeenCalledWith({
      statusCode: 404,
      message: "Route not found"
    });
    expect(req.isProtected).toBeUndefined();
    expect(req.route).toBeUndefined();
  });

  it('should handle route not found when service returns undefined', () => {
    mockRouteSvc.getOne.mockReturnValue(undefined);

    checkRoute(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 404,
      message: "Route not found"
    });
  });

  it('should handle complex URL paths with parameters', () => {
    req.originalUrl = '/api/users/123/profile';
    req.method = 'PUT';
    
    const mockRoute = {
      id: 4,
      url: '/api/users/:id/profile',
      method: 'PUT',
      jwt: true,
      description: 'Update user profile'
    };
    
    mockRouteSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(mockRouteSvc.getOne).toHaveBeenCalledWith('/api/users/123/profile', 'PUT');
    expect(mockLog.debug).toHaveBeenCalledWith('Check route for url PUT:/api/users/123/profile');
  });

  it('should handle query parameters in URL', () => {
    req.originalUrl = '/api/users?limit=10&offset=0';
    req.method = 'GET';
    
    const mockRoute = {
      id: 5,
      url: '/api/users',
      method: 'GET',
      jwt: false,
      description: 'Get users with pagination'
    };
    
    mockRouteSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(mockRouteSvc.getOne).toHaveBeenCalledWith('/api/users?limit=10&offset=0', 'GET');
  });

  it('should handle different HTTP methods', () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    
    methods.forEach((method, index) => {
      jest.clearAllMocks();
      req.method = method;
      req.originalUrl = `/api/test/${index}`;
      
      const mockRoute = {
        id: index + 10,
        url: `/api/test/${index}`,
        method: method,
        jwt: index % 2 === 0,
        description: `Test ${method} endpoint`
      };
      
      mockRouteSvc.getOne.mockReturnValue(mockRoute);

      checkRoute(req, res, next);

      expect(mockRouteSvc.getOne).toHaveBeenCalledWith(`/api/test/${index}`, method);
      expect(req.isProtected).toBe(index % 2 === 0);
      expect(req.route).toEqual(mockRoute);
    });
  });

  it('should handle route with minimal data', () => {
    const mockRoute = {
      id: 6,
      url: '/minimal',
      method: 'GET',
      jwt: false,
      description: 'Minimal route'
    };
    
    req.originalUrl = '/minimal';
    mockRouteSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(req.isProtected).toBe(false);
    expect(req.route).toEqual(mockRoute);
  });

  it('should log route object as JSON string', () => {
    const mockRoute = {
      id: 7,
      url: '/api/complex',
      method: 'POST',
      jwt: true,
      description: 'Complex route',
      config: {
        roles: ['admin', 'user'],
        rateLimit: 100
      }
    };
    
    req.originalUrl = '/api/complex';
    req.method = 'POST';
    mockRouteSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(mockLog.debug).toHaveBeenCalledWith(`Route : ${JSON.stringify(mockRoute)}`);
  });

  it('should handle service throwing error', () => {
    const serviceError = new Error('Service unavailable');
    mockRouteSvc.getOne.mockImplementation(() => {
      throw serviceError;
    });

    expect(() => checkRoute(req, res, next)).toThrow('Service unavailable');
  });
});