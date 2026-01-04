// @ts-check
import { refreshTokens } from "@dwtechs/toker-express";
import express from "express";
const router = express.Router();

import rEnt from "../entities/route.js";
import { checkRequest } from "../middlewares/validators/check-request.js";

const getMany = [
  ...checkRequest,
  rEnt.get,
];

const getHistory = [
  ...checkRequest,
  refreshTokens,
  // history.get,
];

const add = [
  ...checkRequest,
  rEnt.normalizeArray,
  rEnt.validateArray,
  refreshTokens,
  rEnt.add,
];

const update = [
  ...checkRequest,
  rEnt.normalizeArray,
  rEnt.validateArray,
  refreshTokens,
  rEnt.update,
];

const del = [
  ...checkRequest,
  rEnt.delete,
];

// Get routes
router.post("/search", getMany);
// Get updates history of a user
router.get("/:id/history", getHistory);
// add a route.
router.post("/", add);
// Update a route.
router.put("/", update);
// delete a route.
router.delete("/", del);

export default router;
