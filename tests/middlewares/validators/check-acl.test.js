/**
 * @jest-environment node
 */

import { log } from '@dwtechs/winstan';
import roleService from '../../../src/services/role.js';

jest.mock('@dwtechs/winstan');
jest.mock('../../../src/services/role.js', () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn() }
}));

describe('checkAcl middleware', () => {
  let checkAcl;
  let req, res, next;

  beforeAll(async () => {
    const module = await import('../../../src/middlewares/validators/check-acl.js');
    checkAcl = module.default;
  });

  beforeEach(() => {
    req = {};
    res = {
      locals: {
        route: { isProtected: true, id: 10, operationId: 2, url: '/api/test' },
        consumer: { id: 'c1', roles: [1, 2] }
      }
    };
    next = jest.fn();
  });

  it('should call next() immediately for an unprotected route', () => {
    res.locals.route.isProtected = false;

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(roleService.getOne).not.toHaveBeenCalled();
  });

  it('should call next() when a consumer role has the required permission', () => {
    roleService.getOne.mockImplementation((id) => ({
      id,
      name: `role-${id}`,
      permissions: id === 1
        ? [{ route: 10, operations: [2] }]
        : []
    }));

    checkAcl(req, res, next);

    expect(log.debug).toHaveBeenCalledWith(
      'checkAcl(consumer: c1, operation: 2, route: /api/test'
    );
    expect(next).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('should call next(403) when no role has the required permission', () => {
    roleService.getOne.mockReturnValue({
      name: 'viewer',
      permissions: [{ route: 99, operations: [5] }]
    });

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith({ statusCode: 403, message: 'Forbidden' });
  });

  it('should call next(403) when consumer has no roles', () => {
    res.locals.consumer.roles = [];

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith({ statusCode: 403, message: 'Forbidden' });
    expect(roleService.getOne).not.toHaveBeenCalled();
  });

  it('should check all consumer roles before denying access', () => {
    // First role has no permission, second role has the required permission
    roleService.getOne.mockImplementation((id) => ({
      name: `role-${id}`,
      permissions: id === 2
        ? [{ route: 10, operations: [2] }]
        : []
    }));

    checkAcl(req, res, next);

    expect(roleService.getOne).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith();
  });

  it('should deny when operation does not match even if route matches', () => {
    roleService.getOne.mockReturnValue({
      name: 'viewer',
      permissions: [{ route: 10, operations: [99] }] // route matches, operation does not
    });

    checkAcl(req, res, next);

    expect(next).toHaveBeenCalledWith({ statusCode: 403, message: 'Forbidden' });
  });
});
