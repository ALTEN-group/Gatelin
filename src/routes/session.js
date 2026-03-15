// @ts-check
import {
  createTokens,
  decodeAccess,
  decodeRefresh,
  refreshTokens,
} from "@dwtechs/toker-express";
import express from "express";
const router = express.Router();

// import { when } from "../middlewares/conditional.js";

import uEnt from "../entities/user.js";
import sEnt from "../entities/session.js";
import { getUserByEmail, getUserById } from "../middlewares/http/get-user.js";
import { checkPwd } from "../middlewares/http/check-pwd.js";
import { checkRefreshToken } from "../middlewares/validators/check-refreshToken.js";
import { ignoreExpiration } from "../middlewares/mappers/ignore-expiration.js";
import { checkRequest } from "../middlewares/validators/check-request.js"; // Authenticate request and load consumer session
import {
  addToCache,
  updateCache,
  deleteFromCache,
} from "../middlewares/cache/consumer.js";
import { sendSession } from "../middlewares/res/send-session.js";
import { createRow } from "../middlewares/mappers/consumer/createRow.js";
import { send204 } from "../middlewares/res/send-204.js";

// middleware sub-stacks
const checkEmail = [uEnt.normalizeOne, uEnt.validateOne, getUserByEmail];
// const activate = [ activateUser, uEnt.update ];
const getSession = [...checkRequest, createRow]; // get session from tokens
const addSession = [checkPwd, createTokens, sEnt.add, addToCache, sendSession];
const updateSession = [
  refreshTokens,
  getUserById,
  sEnt.update,
  updateCache,
  sendSession,
];
const deleteSession = [sEnt.archive, deleteFromCache, send204];

const add = [
  checkEmail,
  // when(en local res => !res.locals.active, activate),
  addSession,
];

const update = [
  ignoreExpiration,
  getSession,
  checkRefreshToken,
  decodeAccess, // extract issuer
  decodeRefresh, // check expiration
  updateSession,
];

const del = [getSession, deleteSession];

// add a session. e.g. Log a user
router.post("/", add);

// Update a session with new tokens
// Used for automatic login and refresh tokens
router.put("/", update);

// sign-out a user. Used when logging out
router.delete("/", del);

export default router;
