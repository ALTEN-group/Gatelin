// @ts-check
import { refresh as refreshTokens, parseBearerToken, decodeAccess } from "@dwtechs/toker-express";
import express from "express";
const router = express.Router();

// import { when } from "../middlewares/conditional.js";

import uEnt from "../entities/user.js";
import cEnt from "../entities/consumer.js";
import getUserByEmail from "../middlewares/http/get-user-by-email.js";
import checkPwd from "../middlewares/http/check-pwd.js";
import protectRoute from "../middlewares/mappers/protectRoute.js";
import checkToken from "../middlewares/validators/check-token.js";
import addToCache from "../middlewares/cache/addConsumer.js";
import updateCache from "../middlewares/cache/updateConsumer.js";
import sendConsumer from "../middlewares/res/send-consumer.js";

// middleware sub-stacks
const checkEmail = [ uEnt.normalizeOne, uEnt.validateOne, getUserByEmail ];
// const activate = [ activateUser, uEnt.update ];
const addConsumer = [ refreshTokens, cEnt.validateArray, cEnt.add, addToCache ];
const updateConsumer = [ refreshTokens, cEnt.update, updateCache ];

const add = [
  checkEmail,
  // when(en local res => !res.locals.active, activate),
  checkPwd,
  addConsumer,
  sendConsumer
];

const refresh = [
  cEnt.validateOne,
  protectRoute,
  parseBearerToken,
  checkToken,
  decodeAccess,
  updateConsumer,
  sendConsumer
];

const del = [
  checkToken,
  decodeAccess,
  cEnt.delete,
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
