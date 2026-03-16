/**
 * @jest-environment node
 */

import { log } from '@dwtechs/winstan';
import csmerSvc from '../../../src/services/consumer.js';

jest.mock('@dwtechs/winstan');
jest.mock('../../../src/services/consumer.js', () => ({
  __esModule: true,
  default: { getOne: jest.fn() }
}));

describe('checkConsumer middleware', () => {
  let checkConsumer;
  let req, res, next;

  beforeAll(async () => {
    const module = await import('../../../src/middlewares/validators/check-consumer.js');
    checkConsumer = module.default;
  });

  beforeEach(() => {
    req = {};
    res = { locals: { tokens: { access: 'valid-access-token' } } };
    next = jest.fn();
  });

  it('should set res.locals.consumer and call next() when consumer is found', async () => {
    const mockConsumer = { id: 1, userId: 10, nickname: 'alice', roles: [1, 2] };
    csmerSvc.getOne.mockReturnValue(mockConsumer);

    await checkConsumer(req, res, next);

    expect(csmerSvc.getOne).toHaveBeenCalledWith('valid-access-token');
    expect(log.debug).toHaveBeenCalledWith('checkConsumer(accessToken=valid-access-token)');
    expect(log.debug).toHaveBeenCalledWith(`checkConsumer(Consumer: ${JSON.stringify(mockConsumer)})`);
    expect(res.locals.consumer).toBe(mockConsumer);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next(404) when consumer is not found', async () => {
    csmerSvc.getOne.mockReturnValue(null);

    await checkConsumer(req, res, next);

    expect(csmerSvc.getOne).toHaveBeenCalledWith('valid-access-token');
    expect(next).toHaveBeenCalledWith({ status: 404, msg: 'Consumer not found' });
    expect(res.locals.consumer).toBeUndefined();
  });

  it('should call next(404) when consumer service returns undefined', async () => {
    csmerSvc.getOne.mockReturnValue(undefined);

    await checkConsumer(req, res, next);

    expect(next).toHaveBeenCalledWith({ status: 404, msg: 'Consumer not found' });
  });

  it('should read the access token from res.locals.tokens.access', async () => {
    res.locals.tokens.access = 'token-xyz';
    csmerSvc.getOne.mockReturnValue({ id: 2 });

    await checkConsumer(req, res, next);

    expect(csmerSvc.getOne).toHaveBeenCalledWith('token-xyz');
    expect(log.debug).toHaveBeenCalledWith('checkConsumer(accessToken=token-xyz)');
  });
});
