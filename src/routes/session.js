// @ts-check
import {
  createTokens,
  decodeAccess,
  decodeRefresh,
  refreshTokens,
  clearRefreshCookie,
} from "@dwtechs/toker-express";
import express from "express";
const router = express.Router();

// import { when } from "../middlewares/conditional.js";

import uEnt from "../entities/user.js";
import sEnt from "../entities/session.js";
import { attachUserId } from "../middlewares/mappers/consumer/attachUserId.js";
import { filterByEmailNotArchived } from "../middlewares/filters/byEmailNotArchived.js";
import { filterByIdAndActiveNotArchived } from "../middlewares/filters/byIdAndActiveNotArchived.js";
import { getUserByEmail, getUserById } from "../middlewares/http/get-user.js";
import { checkPwd } from "../middlewares/http/check-pwd.js";
import { checkRefreshToken } from "../middlewares/validators/check-refreshToken.js";
import { checkCsrf } from "../middlewares/validators/check-csrf.js";
import { ignoreExpiration } from "../middlewares/mappers/ignore-expiration.js";
import { checkRequest } from "../middlewares/validators/check-request.js"; // Authenticate request and load consumer session
import {
  addToCache,
  updateCache,
  deleteFromCache,
} from "../middlewares/cache/consumer.js";
import { sendSession } from "../middlewares/res/send-session.js";
import {
  setCsrfCookie,
  clearCsrfCookie,
} from "../middlewares/res/csrf-cookie.js";
import { resolvePermissions } from "../middlewares/mappers/resolve-permissions.js";
import { createRow } from "../middlewares/mappers/consumer/createRow.js";
import { send204 } from "../middlewares/res/send-204.js";

const checkEmail = [
  uEnt.normalizeOne,
  uEnt.validateOne,
  filterByEmailNotArchived,
  getUserByEmail,
];
// const activate = [ activateUser, uEnt.update ];
const getSession = [...checkRequest, createRow]; // get session from tokens
const addSession = [
  attachUserId,
  checkPwd,
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
  ignoreExpiration,
  getSession,
  checkCsrf,
  checkRefreshToken,
  decodeAccess, // extract issuer
  decodeRefresh, // check expiration
  updateSession,
];

const del = [getSession, checkCsrf, deleteSession];

// add a session. e.g. Log a user
router.post("/", add);

// Update a session with new tokens
// Used for automatic login and refresh tokens
router.put("/", update);

// sign-out a user. Used when logging out
router.delete("/", del);

export default router;
