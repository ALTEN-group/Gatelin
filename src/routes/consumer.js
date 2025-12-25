// @ts-check
import { log } from "@dwtechs/winstan";
import { refresh as refreshTokens, decodeAccess, decodeRefresh } from "@dwtechs/toker-express";
import { isArray } from "@dwtechs/checkard";
import { deleteProps } from "@dwtechs/sparray";
import express from "express";
const router = express.Router();

// import { when } from "../middlewares/conditional.js";

import uEnt from "../entities/user.js";
import cEnt from "../entities/consumer.js";
import getUserByEmail from "../middlewares/http/get-user-by-email.js";
import checkPwd from "../middlewares/http/check-pwd.js";
import checkToken from "../middlewares/validators/check-token.js";
import addToCache from "../middlewares/mappers/addToCache.js";

function clear(rows, props) {
  if (isArray(props, ">=", 1)) {
    log.debug(`clear unsafe props : [${props.toString()}]`);
    return deleteProps(rows, props);
  }
  return rows;
}

// middleware sub-stacks
const checkEmail = [ uEnt.normalizeOne, uEnt.validateOne, getUserByEmail ];
// const activate = [ activateUser, uEnt.update ];
const addConsumer = [ refreshTokens, cEnt.validateArray, cEnt.add, addToCache ];
const updateConsumer = [ refreshTokens, cEnt.validateOne, cEnt.update ];

const add = [
  checkEmail,
  // when(en local res => !res.locals.active, activate),
  checkPwd,
  addConsumer,
  (req, res, _next) => {
    const data = clear(req.body.rows, cEnt.unsafeProps);
    res.status(200).json(data);
  }
];

const refresh = [
  cEnt.validateOne,
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

// add a consumer. e.g. Log a user
router.post("/", add);

// Update a consumer with new tokens
// Used for automatic login and refresh tokens
router.put("/", refresh);

// delete a consumer. Used when logging out
router.delete("/", del);

export default router;
