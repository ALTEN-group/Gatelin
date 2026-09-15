/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const httpUtilPath = path.join(__dirname, "../../../src/utils/http.js");
const pwdConfPath = path.join(__dirname, "../../../src/conf/pwd.js");

process.env.USER_SEARCH_URL = "https://user.example.com";

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}));
jest.unstable_mockModule(httpUtilPath, () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));
jest.unstable_mockModule(pwdConfPath, () => ({
  loginTicketUrl: "https://pwd.example.com/ticket",
}));

describe("redeemLoginTicket middleware", () => {
  let redeemLoginTicket;
  let mockQuery;
  let req, res, next;

  beforeAll(async () => {
    const httpModule = await import("../../../src/utils/http.js");
    mockQuery = httpModule.default.query;
    const module = await import(
      "../../../src/middlewares/http/redeem-login-ticket.js"
    );
    redeemLoginTicket = module.redeemLoginTicket;
  });

  beforeEach(() => {
    mockQuery.mockReset();
    req = { body: { ticket: "ticket-1" } };
    res = { locals: {} };
    next = jest.fn();
  });

  it("should look up the redeemed user as active and not archived", async () => {
    const user = {
      id: 7,
      nickname: "alice",
      email: "alice@example.com",
      roles: [1],
      active: true,
    };
    mockQuery.mockImplementation((_verb, url) => {
      if (url === "https://pwd.example.com/ticket")
        return Promise.resolve({ data: { userId: 7 } });
      return Promise.resolve({ data: { rows: [user] } });
    });

    await redeemLoginTicket(req, res, next);
    await Promise.resolve();

    expect(mockQuery).toHaveBeenCalledWith(
      "POST",
      "https://user.example.com",
      undefined,
      {
        filters: {
          id: { value: 7, matchMode: "equals" },
          active: { value: true, matchMode: "IS" },
          archived: { value: false, matchMode: "IS" },
        },
      },
      undefined,
    );
    expect(req.body.rows).toEqual([
      { userId: 7, nickname: "alice", roles: [1] },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(400) when the ticket is missing", async () => {
    req.body = {};

    await redeemLoginTicket(req, res, next);

    expect(mockQuery).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Missing ticket",
    });
  });

  it("should call next(403) when the redeemed user is not active", async () => {
    mockQuery.mockImplementation((_verb, url) => {
      if (url === "https://pwd.example.com/ticket")
        return Promise.resolve({ data: { userId: 7 } });
      return Promise.resolve({
        data: {
          rows: [
            {
              id: 7,
              nickname: "alice",
              email: "alice@example.com",
              roles: [1],
              active: false,
            },
          ],
        },
      });
    });

    await redeemLoginTicket(req, res, next);
    await Promise.resolve();

    expect(next).toHaveBeenCalledWith({
      statusCode: 403,
      message: "Account not activated",
    });
    expect(req.body.rows).toBeUndefined();
  });
});
