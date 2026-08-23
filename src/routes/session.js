// @ts-check
import {
  clearRefreshCookie,
  createTokens,
  decodeRefresh,
  refreshTokens,
} from "@dwtechs/toker-express";
import express from "express";

const router = express.Router();

// import { when } from "../middlewares/conditional.js";

import sEnt from "../entities/session.js";
import uEnt from "../entities/user.js";
import {
  addToCache,
  deleteFromCache,
  updateCache,
} from "../middlewares/cache/consumer.js";
import { filterByEmailNotArchived } from "../middlewares/filters/byEmailNotArchived.js";
import { filterByIdAndActiveNotArchived } from "../middlewares/filters/byIdAndActiveNotArchived.js";
import { checkPwd } from "../middlewares/http/check-pwd.js";
import { gateLoginChallenges } from "../middlewares/http/gate-login-challenges.js";
import { redeemLoginTicket } from "../middlewares/http/redeem-login-ticket.js";
import { getUserByEmail, getUserById } from "../middlewares/http/get-user.js";
import { attachUserId } from "../middlewares/mappers/consumer/attachUserId.js";
import { createRow } from "../middlewares/mappers/consumer/createRow.js";
import { resolvePermissions } from "../middlewares/mappers/resolve-permissions.js";
import {
  clearCsrfCookie,
  setCsrfCookie,
} from "../middlewares/res/csrf-cookie.js";
import { send204 } from "../middlewares/res/send-204.js";
import { sendSession } from "../middlewares/res/send-session.js";
import checkConsumerByRefreshToken from "../middlewares/validators/check-consumer-by-refresh-token.js";
import { checkCsrf } from "../middlewares/validators/check-csrf.js";
import { checkRefreshToken } from "../middlewares/validators/check-refreshToken.js";
import { checkRequest } from "../middlewares/validators/check-request.js"; // Authenticate request and load consumer session

const checkEmail = [
  uEnt.normalizeOne,
  uEnt.validateOne,
  filterByEmailNotArchived,
  getUserByEmail,
];
// const activate = [ activateUser, uEnt.update ];
const getSession = [...checkRequest, createRow]; // get session from tokens (access-token based, used by GET/DELETE)
// get session purely from the refresh token (cookie or body) — no access token required.
const getSessionByRefreshToken = [
  decodeRefresh,
  checkConsumerByRefreshToken,
  createRow,
];
const addSession = [
  attachUserId,
  checkPwd,
  gateLoginChallenges,
  createTokens,
  sEnt.add,
  addToCache,
  resolvePermissions,
  setCsrfCookie,
  sendSession,
];
const resumeSession = [
  redeemLoginTicket,
  createTokens,
  sEnt.add,
  addToCache,
  resolvePermissions,
  setCsrfCookie,
  sendSession,
];
const updateSession = [
  refreshTokens,
  filterByIdAndActiveNotArchived,
  getUserById,
  sEnt.update,
  updateCache,
  resolvePermissions,
  setCsrfCookie,
  sendSession,
];
const deleteSession = [
  sEnt.archive,
  deleteFromCache,
  clearRefreshCookie,
  clearCsrfCookie,
  send204,
];

const add = [
  checkEmail,
  // when(en local res => !res.locals.active, activate),
  addSession,
];

const update = [
  getSessionByRefreshToken,
  checkCsrf,
  checkRefreshToken,
  updateSession,
];

const del = [getSession, checkCsrf, deleteSession];

// add a session. e.g. Log a user
router.post("/", add);

// Finish login after Foxnox mid-login challenges (2FA / expired password / trusted device)
router.post("/resume", resumeSession);

// Update a session with new tokens
// Used for automatic login and refresh tokens
router.put("/", update);

// sign-out a user. Used when logging out
router.delete("/", del);

export default router;
