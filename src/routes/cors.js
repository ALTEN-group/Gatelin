// @ts-check
import express from "express";
const router = express.Router();

import cEnt from "../entities/cors.js";
import { addToCache, updateCache, deleteFromCache } from "../middlewares/cache/cors.js";

const getMany = [
  cEnt.get,
];

const add = [
  cEnt.normalizeArray,
  cEnt.validateArray,
  cEnt.add,
  addToCache,  // Update cache after DB insertion
];

const update = [
  cEnt.normalizeArray,
  cEnt.validateArray,
  cEnt.update,
  updateCache,  // Update cache after DB update
];

const del = [
  cEnt.delete,
  deleteFromCache,  // Remove from cache after DB deletion
];

// Get routes
router.post("/search", getMany);
// Get updates history of a user
// router.get("/:id/history", getHistory);
// add a route.
router.post("/", add);
// Update a route.
router.put("/", update);
// delete a route.
router.delete("/", del);

export default router;
