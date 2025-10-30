// @ts-check
import { refresh } from "@dwtechs/toker-express";
import express from "express";
const router = express.Router();

import entity from "../entities/route.js";
import { checkRequest } from "../middlewares/validators/check-request.js";

const getMany = [
  ...checkRequest,
  // pk.refresh,
  // entity.get,
];

const getHistory = [
  ...checkRequest,
  refresh,
  // history.get,
];

const add = [
  ...checkRequest,
  entity.normalize,
  entity.validate,
  refresh,
  entity.add,
];

const update = [
  ...checkRequest,
  entity.normalize,
  entity.validate,
  refresh,
  entity.update,
];

const del = [
  ...checkRequest,
  entity.delete,
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
