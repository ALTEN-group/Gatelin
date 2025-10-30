// @ts-check
import {refresh as refreshTokens, decodeAccess, decodeRefresh} from "@dwtechs/toker-express";
import express from "express";
const router = express.Router();

// import { when } from "../middlewares/conditional.js";

import uEnt from "../entities/user.js";
import cEnt from "../entities/consumer.js";
import getUserByEmail from "../middlewares/http/get-user-by-email.js";
import checkPwd from "../middlewares/http/check-pwd.js";
import checkToken from "../middlewares/validators/check-token.js";

// middleware sub-stacks
const checkEmail = [ uEnt.normalize, uEnt.validate, getUserByEmail ];
// const activate = [ activateUser, uEnt.update ];
const addConsumer = [ refreshTokens, cEnt.validate, cEnt.add ];
const updateConsumer = [ refreshTokens, cEnt.validate, cEnt.update ];

const add = [
  checkEmail,
  // when(en local res => !res.locals.active, activate),
  checkPwd,
  addConsumer,
];

const refresh = [
  cEnt.validate,
  decodeAccess,
  decodeRefresh,
  checkToken,
  updateConsumer
];

const del = [
  checkToken,
  decodeAccess,
  cEnt.delete,
];
//Routes

// add a consumer. Log a user
router.post("/", add);

// Update a consumer with new tokens
// Used for automatic login and refresh tokens
router.put("/", refresh);

// delete a consumer. Used when logging out
router.delete("/", del);

export default router;
