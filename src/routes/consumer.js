// @ts-check
import { refresh as refreshTokens, parseBearerToken, decodeAccess, decodeRefresh } from "@dwtechs/toker-express";
import express from "express";
const router = express.Router();

// import { when } from "../middlewares/conditional.js";

import uEnt from "../entities/user.js";
import cEnt from "../entities/consumer.js";
import getUserByEmail from "../middlewares/http/get-user-by-email.js";
import checkPwd from "../middlewares/http/check-pwd.js";
import checkRefreshToken from "../middlewares/validators/check-refreshToken.js";
import { getFromCache, addToCache, updateCache, deleteFromCache } from "../middlewares/cache/consumer.js";
import sendConsumer from "../middlewares/res/send-consumer.js";

// middleware sub-stacks
const checkEmail = [ uEnt.normalizeOne, uEnt.validateOne, getUserByEmail ];
// const activate = [ activateUser, uEnt.update ];
const getConsumer = [ /**protectRoute, **/parseBearerToken, getFromCache ]; // get consumer from tokens
const addConsumer = [ checkPwd, refreshTokens, cEnt.validateArray, cEnt.add, addToCache ];
const updateConsumer = [ refreshTokens, cEnt.update, updateCache ];
const deleteConsumer = [ cEnt.delete, deleteFromCache ];

const add = [
  checkEmail,
  // when(en local res => !res.locals.active, activate),
  addConsumer,
  sendConsumer
];

const refresh = [
  getConsumer,
  checkRefreshToken,
  decodeAccess, // extract issuer
  decodeRefresh, // check expiration
  updateConsumer,
  sendConsumer
];

const del = [
  getConsumer,
  deleteConsumer,
  (_req, res, _next) => {
    res.status(204).send();
  }
];
//Routes

// add a consumer. e.g. Log a user
router.post("/", add);

// Update a consumer with new tokens
// Used for automatic login and refresh tokens
router.put("/", refresh);

// delete a consumer. Used when logging out
router.delete("/", del);

export default router;
