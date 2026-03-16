/**
 * @jest-environment node
 */

import { log } from '@dwtechs/winstan';

jest.mock('@dwtechs/winstan');

describe('updateHeaderWithConsumer middleware', () => {
  let updateHeaderWithConsumer;
  let req, res, next;

  beforeAll(async () => {
    const module = await import('../../../src/middlewares/mappers/additionalHeaders.js');
    updateHeaderWithConsumer = module.default;
  });

  beforeEach(() => {
    req = {};
    res = {
      locals: {
        route: { isProtected: true },
        tokens: { decodedAccess: { iss: 'consumer-123', sub: 'user-456' } },
        consumer: { nickname: 'testuser' }
      }
    };
    next = jest.fn();
  });

  describe('protected route', () => {
    it('should set additionalHeaders from token and consumer, call next()', () => {
      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        'x-consumer-id': 'consumer-123',
        'x-consumer-name': 'testuser'
      });
      expect(next).toHaveBeenCalledWith();
      expect(log.debug).toHaveBeenCalledWith(
        `updateHeaderWithConsumer(decodedAccessToken=${JSON.stringify({ iss: 'consumer-123', sub: 'user-456' })})`
      );
      expect(log.debug).toHaveBeenCalledWith(
        `updateHeaders(${JSON.stringify({ 'x-consumer-id': 'consumer-123', 'x-consumer-name': 'testuser' })})`
      );
    });

    it('should use iss as consumer-id and nickname as consumer-name', () => {
      res.locals.tokens.decodedAccess.iss = 'other-consumer';
      res.locals.consumer.nickname = 'other_user';

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toEqual({
        'x-consumer-id': 'other-consumer',
        'x-consumer-name': 'other_user'
      });
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('unprotected route', () => {
    it('should skip header setup and call next() immediately', () => {
      res.locals.route.isProtected = false;

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
      expect(log.debug).not.toHaveBeenCalled();
    });

    it('should skip when isProtected is null', () => {
      res.locals.route.isProtected = null;

      updateHeaderWithConsumer(req, res, next);

      expect(req.additionalHeaders).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('error conditions', () => {
    it('should throw when res.locals.route is undefined', () => {
      res.locals.route = undefined;

      expect(() => updateHeaderWithConsumer(req, res, next)).toThrow();
    });

    it('should throw when res.locals.tokens is undefined on a protected route', () => {
      res.locals.tokens = undefined;

      expect(() => updateHeaderWithConsumer(req, res, next)).toThrow();
    });
  });
});
