// @ts-check
import { createTokens, refreshTokens, parseBearer, decodeAccess, decodeRefresh } from "@dwtechs/toker-express";
import express from "express";
const router = express.Router();

// import { when } from "../middlewares/conditional.js";

import uEnt from "../entities/user.js";
import cEnt from "../entities/consumer.js";
import { getUserByEmail } from "../middlewares/http/get-user.js";
import { checkPwd } from "../middlewares/http/check-pwd.js";
import { checkRefreshToken } from "../middlewares/validators/check-refreshToken.js";
import { ignoreExpiration } from "../middlewares/mappers/ignore-expiration.js";
import { getFromCache, addToCache, updateCache, deleteFromCache } from "../middlewares/cache/consumer.js";
import { sendConsumer } from "../middlewares/res/send-consumer.js";
import { createRow } from "../middlewares/mappers/consumer/createRow.js";
import { send204 } from "../middlewares/res/send-204.js";

// middleware sub-stacks
const checkEmail = [ uEnt.normalizeOne, uEnt.validateOne, getUserByEmail ];
// const activate = [ activateUser, uEnt.update ];
const getConsumer = [ parseBearer, getFromCache, createRow ]; // get consumer from tokens
const addConsumer = [ checkPwd, createTokens, cEnt.validateArray, cEnt.add, addToCache, sendConsumer ];
const updateConsumer = [ refreshTokens, cEnt.update, updateCache, sendConsumer ];
const deleteConsumer = [ cEnt.delete, deleteFromCache, send204 ];

const add = [
  checkEmail,
  // when(en local res => !res.locals.active, activate),
  addConsumer
];

const getMany = [
  cEnt.get,
];

const update = [
  getConsumer,
  checkRefreshToken,
  ignoreExpiration,
  decodeAccess, // extract issuer
  decodeRefresh, // check expiration
  updateConsumer
];

const del = [
  getConsumer,
  deleteConsumer
];

//Routes

// Get routes
router.post("/search", getMany);
// add a consumer. e.g. Log a user
router.post("/", add);

// Update a consumer with new tokens
// Used for automatic login and refresh tokens
router.put("/", update);

// delete a consumer. Used when logging out
router.delete("/", del);

export default router;
