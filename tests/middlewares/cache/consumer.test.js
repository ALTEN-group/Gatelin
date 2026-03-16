/**
 * @jest-environment node
 */

import { log } from '@dwtechs/winstan';
import csmerSvc from '../../../src/services/consumer.js';

jest.mock('@dwtechs/winstan');
jest.mock('../../../src/services/consumer.js', () => ({
  __esModule: true,
  default: { updateCache: jest.fn() }
}));

describe('updateCache middleware', () => {
  let updateCache;
  let req, res, next;

  beforeAll(async () => {
    const module = await import('../../../src/middlewares/cache/consumer.js');
    updateCache = module.updateCache;
  });

  beforeEach(() => {
    req = {
      body: {
        rows: [{ id: 5, accessToken: 'new-access', refreshToken: 'new-refresh', roles: [1, 2] }]
      }
    };
    res = { locals: {} };
    next = jest.fn();
  });

  it('should update cache with correct arguments and call next()', () => {
    csmerSvc.updateCache.mockReturnValue(true);

    updateCache(req, res, next);

    expect(log.debug).toHaveBeenCalledWith('Updating consumer 5 in cache');
    expect(csmerSvc.updateCache).toHaveBeenCalledWith(5, 'new-access', 'new-refresh', [1, 2]);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next(404) when consumer is not found in cache', () => {
    csmerSvc.updateCache.mockReturnValue(false);

    updateCache(req, res, next);

    expect(csmerSvc.updateCache).toHaveBeenCalledWith(5, 'new-access', 'new-refresh', [1, 2]);
    expect(next).toHaveBeenCalledWith({ status: 404, msg: 'Consumer not updated in cache' });
  });

  it('should read id, accessToken, refreshToken and roles from req.body.rows[0]', () => {
    req.body.rows[0] = { id: 99, accessToken: 'at', refreshToken: 'rt', roles: [3] };
    csmerSvc.updateCache.mockReturnValue(true);

    updateCache(req, res, next);

    expect(csmerSvc.updateCache).toHaveBeenCalledWith(99, 'at', 'rt', [3]);
    expect(next).toHaveBeenCalledWith();
  });
});
